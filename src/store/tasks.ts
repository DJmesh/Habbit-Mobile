import { create } from 'zustand';
import { getItem, setItem } from '@/lib/storage';
import { type DB, type Task, seed } from '@/lib/mockDb';

const KEY = 'DB_V1';

type TaskState = {
  db: DB;
  reload: () => Promise<void>;
  addTask: (title: string, dateISO?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
};

function todayISO() {
  return new Date().toISOString();
}

export const useTasks = create<TaskState>((set, get) => ({
  db: seed,

  async reload() {
    const next = await getItem<DB>(KEY, seed);
    set({ db: next });
  },

  async addTask(title: string, dateISOParam?: string) {
    const { db } = get();
    const next: DB = { ...db, tasks: [...db.tasks] };
    const id = 't_' + Math.random().toString(36).slice(2, 10);
    const t: Task = {
      id,
      title: title.trim() || 'Nova tarefa',
      date: (dateISOParam || todayISO()),
      done: false,
    };
    next.tasks.unshift(t);
    set({ db: next });
    await setItem(KEY, next);
  },

  async toggleTask(id: string) {
    const { db } = get();
    const next: DB = { ...db, tasks: db.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) };
    set({ db: next });
    await setItem(KEY, next);
  },
}));
