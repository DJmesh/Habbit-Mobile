import { create } from 'zustand';
import { getItem, setItem } from '@/lib/storage';
import {
  ensureNotificationPermission,
  scheduleReminder,
  cancelReminder,
  type HabitReminder,
  type Weekday,
} from '@/lib/notifications';

const KEY = 'REMINDERS_V1';

type State = {
  reminders: HabitReminder[];
  load: () => Promise<void>;
  setReminder: (habitId: string, hour: number, minute: number, days: Weekday[]) => Promise<void>;
  removeReminder: (habitId: string) => Promise<void>;
  getByHabit: (habitId: string) => HabitReminder | undefined;
};

export const useReminders = create<State>((set, get) => ({
  reminders: [],

  async load() {
    const raw = await getItem(KEY);
    if (!raw) return;
    try {
      const arr: HabitReminder[] = JSON.parse(raw);
      set({ reminders: arr });
    } catch {}
  },

  getByHabit(habitId) {
    return get().reminders.find(r => r.habitId === habitId);
  },

  async setReminder(habitId, hour, minute, days) {
    const ok = await ensureNotificationPermission();
    const base: HabitReminder = { habitId, hour, minute, days };

    let reminders = [...get().reminders];
    const idx = reminders.findIndex(r => r.habitId === habitId);

    const notifIds = await scheduleReminder(base).catch(() => Promise.resolve([]));
    const next: HabitReminder = { ...base, notifIds };

    if (idx >= 0) reminders[idx] = next;
    else reminders.push(next);

    set({ reminders });
    await setItem(KEY, JSON.stringify(reminders));
  },

  async removeReminder(habitId) {
    const cur = get().reminders.find(r => r.habitId === habitId);
    if (cur) await cancelReminder(cur).catch(() => {});
    const reminders = get().reminders.filter(r => r.habitId !== habitId);
    set({ reminders });
    await setItem(KEY, JSON.stringify(reminders));
  },
}));
