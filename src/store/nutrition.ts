import { create } from 'zustand';
import { getItem, setItem } from '@/lib/storage';
import { type DB, type Meal, seed } from '@/lib/mockDb';

const KEY = 'DB_V1';

type NutritionState = {
  db: DB;
  reload: () => Promise<void>;
  addMeal: (name: string, calories: number, protein: number, carbs: number, fat: number, dateISO?: string) => Promise<void>;
  totalsForDate: (dateISO: string) => { calories: number; protein: number; carbs: number; fat: number };
};

export const useNutrition = create<NutritionState>((set, get) => ({
  db: seed,

  async reload() {
    const loaded = await getItem<DB>(KEY, seed);
    set({ db: loaded });
  },

  async addMeal(name, calories, protein, carbs, fat, dateISO) {
    const { db } = get();
    const meal: Meal = { id: 'm' + (db.meals.length + 1), name, calories, protein, carbs, fat, date: dateISO ?? new Date().toISOString() };
    const next: DB = { ...db, meals: [...db.meals, meal] };
    set({ db: next });
    await setItem(KEY, next);
  },

  totalsForDate(dateISO: string) {
    const { db } = get();
    const d = dateISO.slice(0,10);
    const inDay = db.meals.filter(m => m.date.slice(0,10) === d);
    return inDay.reduce((acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }
}));
