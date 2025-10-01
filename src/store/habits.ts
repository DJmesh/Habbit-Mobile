import { create } from 'zustand';
import { getItem, setItem } from '@/lib/storage';
import { type Habit, type HabitLog, type DB, seed } from '@/lib/mockDb';

const KEY = 'DB_V1';

type HabitState = {
  db: DB;
  reload: () => Promise<void>;
  addHabit: (title: string, targetPerDay: number, icon?: string) => Promise<void>;
  logHabit: (habitId: string, amount: number, dateISO?: string) => Promise<void>;
  setDoneToday: (habitId: string) => Promise<void>;
};

export const useHabits = create<HabitState>((set, get) => ({
  db: seed,

  async reload() {
    const loaded = await getItem<DB>(KEY, seed);
    set({ db: loaded });
  },

  async addHabit(title, targetPerDay, icon) {
    const { db } = get();
    const habit: Habit = { id: 'h' + (db.habits.length + 1), title, icon, targetPerDay };
    const next: DB = { ...db, habits: [...db.habits, habit] };
    set({ db: next });
    await setItem(KEY, next);
  },

  async logHabit(habitId, amount, dateISO) {
    const { db } = get();
    const log: HabitLog = { id: 'l' + (db.logs.length + 1), habitId, date: dateISO ?? new Date().toISOString(), amount };
    const next: DB = { ...db, logs: [...db.logs, log] };
    set({ db: next });
    await setItem(KEY, next);
  },

  async setDoneToday(habitId) {
    const { db } = get();
    const has = db.logs.some(l => l.habitId === habitId && l.date.slice(0,10) === new Date().toISOString().slice(0,10));
    if (has) return;
    const log: HabitLog = { id: 'l' + (db.logs.length + 1), habitId, date: new Date().toISOString(), amount: 1 };
    const next: DB = { ...db, logs: [...db.logs, log] };
    set({ db: next });
    await setItem(KEY, next);
  }
}));
