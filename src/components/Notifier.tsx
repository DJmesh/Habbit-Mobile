import React, { useEffect, useRef } from 'react';
import { Vibration } from 'react-native';
import * as Speech from 'expo-speech';
import { useReminders } from '@/store/reminders';
import { useHabits } from '@/store/habits';

const FIVE_MIN = 5 * 60 * 1000;

function nextTimeToday(hour: number, minute: number) {
  const n = new Date();
  const t = new Date(n);
  t.setHours(hour, minute, 0, 0);
  return t;
}

export default function Notifier() {
  const reminders = useReminders();
  const { db } = useHabits();
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const weekday = now.getDay() as 0|1|2|3|4|5|6;

      for (const r of reminders.reminders) {
        if (!r.days.includes(weekday)) continue;
        const at = nextTimeToday(r.hour, r.minute);
        const diff = +at - +now;
        if (diff <= FIVE_MIN && diff > 0) {
          const key = `${now.toDateString()}_${r.habitId}_${r.hour}:${r.minute}`;
          if (fired.current.has(key)) continue;
          fired.current.add(key);

          // vibra 1s
          Vibration.vibrate(1000);

          // fala o hábito
          const habitTitle = db.habits.find(h => h.id === r.habitId)?.title ?? 'seu hábito';
          Speech.speak(`Faltam cinco minutos para ${habitTitle}. Bora concluir!`, { language: 'pt-BR', pitch: 1, rate: 1.0 });
        }
      }
    }, 30 * 1000); // checa a cada 30s

    return () => clearInterval(id);
  }, [reminders.reminders, db.habits]);

  return null;
}
