import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import ReminderModal from './ReminderModal';
import { useReminders } from '@/store/reminders';
import { useHabits } from '@/store/habits';

const FIVE_MIN = 5 * 60 * 1000;

function isTodayWeekdayMatch(days: number[]): boolean {
  const wd = new Date().getDay(); // 0..6
  return days.includes(wd as any);
}

function buildKey(habitId: string, dateISO: string) {
  return `${habitId}@${dateISO.slice(0,10)}`;
}

export default function DueSoonWatcher() {
  const { reminders, load } = useReminders();
  const { db } = useHabits();
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const alerted = useRef(new Set<string>());
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const habitTitleById = useMemo(() => Object.fromEntries(db.habits.map(h => [h.id, h.title])), [db.habits]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const isoToday = now.toISOString();
      for (const r of reminders) {
        if (!isTodayWeekdayMatch(r.days)) continue;
        const target = new Date();
        target.setHours(r.hour, r.minute, 0, 0);
        const diff = +target - +now;
        if (diff <= FIVE_MIN && diff >= 0) {
          const k = buildKey(r.habitId, isoToday);
          if (!alerted.current.has(k)) {
            alerted.current.add(k);
            setMsg(`Faltam ~${Math.max(1, Math.ceil(diff/60000))} min para: ${habitTitleById[r.habitId] ?? r.habitId}`);
            setVisible(true);
            break;
          }
        }
      }
    };

    const interval = setInterval(tick, 30000);
    const sub = AppState.addEventListener('change', (s) => {
      appState.current = s;
      if (s === 'active') tick();
    });
    tick(); // primeira checagem
    return () => { clearInterval(interval); sub.remove(); };
  }, [reminders, habitTitleById]);

  return <ReminderModal visible={visible} title={msg} onClose={() => setVisible(false)} />;
}
