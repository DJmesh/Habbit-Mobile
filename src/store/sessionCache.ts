import { create } from 'zustand';
import { getItem, setItem } from '@/lib/storage';

const KEY = 'HABIT_PERIODS_V1';

export type HabitPeriod = { habitId: string; startISO: string | null; endISO: string | null };

type State = {
  periods: Record<string, HabitPeriod>;
  load: () => Promise<void>;
  getPeriod: (habitId: string) => HabitPeriod | undefined;
  getAll: () => HabitPeriod[];
  setStart: (habitId: string, startISO: string | null) => Promise<void>;
  setEnd: (habitId: string, endISO: string | null) => Promise<void>;
};

export const useSessionCache = create<State>((set, get) => ({
  periods: {},

  async load() {
    const raw = await getItem(KEY);
    if (!raw) return;
    try {
      const arr: HabitPeriod[] = JSON.parse(raw);
      const dict: Record<string, HabitPeriod> = {};
      for (const p of arr) dict[p.habitId] = p;
      set({ periods: dict });
    } catch {}
  },

  getPeriod(habitId) {
    return get().periods[habitId];
  },

  getAll() {
    return Object.values(get().periods);
  },

  async setStart(habitId, startISO) {
    const p: HabitPeriod = { habitId, startISO, endISO: get().periods[habitId]?.endISO ?? null };
    set({ periods: { ...get().periods, [habitId]: p } });
    await setItem(KEY, JSON.stringify(get().getAll()));
  },

  async setEnd(habitId, endISO) {
    const p: HabitPeriod = { habitId, startISO: get().periods[habitId]?.startISO ?? null, endISO };
    set({ periods: { ...get().periods, [habitId]: p } });
    await setItem(KEY, JSON.stringify(get().getAll()));
  },
}));
