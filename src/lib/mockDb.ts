import { subDays } from 'date-fns';

export type User = { id: string; name: string; email: string; password: string };
export type Habit = { id: string; title: string; icon?: string; targetPerDay: number };
export type HabitLog = { id: string; habitId: string; date: string; amount: number };
export type Meal = { id: string; date: string; name: string; calories: number; protein: number; carbs: number; fat: number };
export type Task = { id: string; title: string; date: string; done: boolean };
export type GPSPoint = { id: string; lat: number; lon: number; timestamp: number };
export type GPSSession = { id: string; startedAt: number; endedAt?: number; points: GPSPoint[] };

export type DB = {
  users: User[];
  habits: Habit[];
  logs: HabitLog[];
  meals: Meal[];
  tasks: Task[];
  currentUserId: string | null;
  gpsSessions: GPSSession[];
  locationRecording: boolean;
};

const today = new Date();
function iso(d: Date) { return d.toISOString(); }

export const seed: DB = {
  users: [
    { id: 'u1', name: 'Eduardo', email: 'edu@example.com', password: '123456' },
    { id: 'u2', name: 'Guest', email: 'guest@example.com', password: '123456' }
  ],
  habits: [
    { id: 'h1', title: 'Beber água', icon: 'water', targetPerDay: 8 },
    { id: 'h2', title: 'Ler 20min', icon: 'book', targetPerDay: 1 },
    { id: 'h3', title: 'Treino', icon: 'dumbbell', targetPerDay: 1 }
  ],
  logs: [
    { id: 'l1', habitId: 'h1', date: iso(subDays(today,1)), amount: 8 },
    { id: 'l2', habitId: 'h2', date: iso(subDays(today,1)), amount: 1 },
    { id: 'l3', habitId: 'h3', date: iso(subDays(today,1)), amount: 1 },
    { id: 'l4', habitId: 'h1', date: iso(today), amount: 5 }
  ],
  meals: [
    { id: 'm1', date: iso(today), name: 'Café da manhã', calories: 350, protein: 20, carbs: 40, fat: 12 },
    { id: 'm2', date: iso(today), name: 'Almoço', calories: 650, protein: 35, carbs: 70, fat: 20 }
  ],
  tasks: [
    { id: 't1', title: 'Respiração 4-7-8', date: iso(today), done: false },
    { id: 't2', title: 'Responder e-mails', date: iso(today), done: true },
    { id: 't3', title: 'Meditação 10min', date: iso(subDays(today,1)), done: true }
  ],
  currentUserId: 'u1',
  gpsSessions: [],
  locationRecording: false
};
