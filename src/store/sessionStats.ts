import { create } from 'zustand';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { useHabits } from './habits';
import { useTasks } from './tasks';
import { useNutrition } from './nutrition';

type PerHabit = { habitId: string; title: string; count: number };
type PctByHabit = { habitId: string; title: string; pct: number };

export type SessionSnapshot = {
  totalLogs: number;
  bestStreak: number;
  perHabit: PerHabit[];
  completionPctByHabit: PctByHabit[];

  tasks: {
    todayDone: number;
    todayTotal: number;
    weekDone: number;
    weekTotal: number;
  };

  nutritionToday: { calories: number; protein: number; carbs: number; fat: number };
  nutritionWeek: { calories: number; protein: number; carbs: number; fat: number };
};

type SessionStatsState = {
  current: SessionSnapshot | null;
  recompute: () => void;
};

function pct(n: number, d: number) {
  if (d <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((n / d) * 100)));
}

export const useSessionStats = create<SessionStatsState>(() => ({
  current: null,
  recompute() {
    const habitsStore = useHabits.getState();
    const tasksStore = useTasks.getState();
    const nutritionStore = useNutrition.getState();

    const now = new Date();
    const weekRange = {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: endOfWeek(now, { weekStartsOn: 1 }),
    };
    const todayISO = now.toISOString().slice(0, 10);

    const weekLogs = habitsStore.db.logs.filter((l) => {
      const d = parseISO(l.date);
      return isWithinInterval(d, weekRange);
    });

    const totalLogs = weekLogs.length;

    const perHabitMap = new Map<string, PerHabit>();
    for (const h of habitsStore.db.habits) {
      perHabitMap.set(h.id, { habitId: h.id, title: h.title, count: 0 });
    }
    for (const l of weekLogs) {
      const row = perHabitMap.get(l.habitId);
      if (row) row.count += l.amount ?? 1;
    }
    const perHabit = Array.from(perHabitMap.values());

    const completionPctByHabit: PctByHabit[] = habitsStore.db.habits.map((h) => {
      const row = perHabitMap.get(h.id);
      const targetWeek = (h.targetPerDay || 1) * 7;
      return { habitId: h.id, title: h.title, pct: pct(row?.count || 0, targetWeek) };
    });


    const dayHasLog = new Set(weekLogs.map((l) => l.date.slice(0, 10)));
    let bestStreak = 0;
    let cur = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekRange.start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      if (dayHasLog.has(key)) {
        cur += 1;
        bestStreak = Math.max(bestStreak, cur);
      } else {
        cur = 0;
      }
    }

    const weekTasks = tasksStore.db.tasks.filter((t) =>
      isWithinInterval(parseISO(t.date), weekRange)
    );
    const weekDone = weekTasks.filter((t) => t.done).length;
    const todayTasks = tasksStore.db.tasks.filter((t) => t.date.slice(0, 10) === todayISO);
    const todayDone = todayTasks.filter((t) => t.done).length;

    const weekMeals = nutritionStore.db.meals.filter((m) =>
      isWithinInterval(parseISO(m.date), weekRange)
    );
    const sum = (arr: any[], k: string) => arr.reduce((acc, it) => acc + (Number(it[k]) || 0), 0);
    const nutritionWeek = {
      calories: sum(weekMeals, 'calories'),
      protein: sum(weekMeals, 'protein'),
      carbs: sum(weekMeals, 'carbs'),
      fat: sum(weekMeals, 'fat'),
    };
    const todayMeals = nutritionStore.db.meals.filter((m) => m.date.slice(0, 10) === todayISO);
    const nutritionToday = {
      calories: sum(todayMeals, 'calories'),
      protein: sum(todayMeals, 'protein'),
      carbs: sum(todayMeals, 'carbs'),
      fat: sum(todayMeals, 'fat'),
    };

    const snapshot: SessionSnapshot = {
      totalLogs,
      bestStreak,
      perHabit,
      completionPctByHabit,
      tasks: {
        todayDone,
        todayTotal: todayTasks.length,
        weekDone,
        weekTotal: weekTasks.length,
      },
      nutritionToday,
      nutritionWeek,
    };

    useSessionStats.setState({ current: snapshot });
  },
}));
