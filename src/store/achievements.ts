import { create } from 'zustand';

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'flame' | 'diamond' | 'medal';
  color: string;
  accent: string;
  unlocked: boolean;
  unlockedAt?: number;
};

type AchievementsState = {
  badges: Badge[];
  unlock: (id: string) => boolean;
  resetAll: () => void;
  mockUnlockNext: () => string | null;
};

const initialBadges: Badge[] = [
  {
    id: 'first_habit',
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro hábito hoje.',
    icon: 'trophy',
    color: '#2EAAB0',
    accent: '#7C4DFF',
    unlocked: false
  },
  {
    id: 'daily_3',
    title: 'Trio do Dia',
    description: 'Complete 3 hábitos em um único dia.',
    icon: 'star',
    color: '#FFC107',
    accent: '#FF7043',
    unlocked: false
  },
  {
    id: 'streak_3',
    title: 'Sequência de 3 Dias',
    description: 'Mantenha uma sequência de 3 dias em qualquer hábito.',
    icon: 'flame',
    color: '#FF5252',
    accent: '#FFAB40',
    unlocked: false
  },
  {
    id: 'focused',
    title: 'Mente Focada',
    description: 'Registre um hábito 7 vezes em uma semana.',
    icon: 'diamond',
    color: '#00C853',
    accent: '#00BFA5',
    unlocked: false
  },
  {
    id: 'champion',
    title: 'Campeão',
    description: 'Conclua todas as metas do dia.',
    icon: 'medal',
    color: '#42A5F5',
    accent: '#1DE9B6',
    unlocked: false
  }
];

export const useAchievements = create<AchievementsState>((set, get) => ({
  badges: initialBadges,

  unlock(id) {
    const { badges } = get();
    const idx = badges.findIndex(b => b.id === id);
    if (idx < 0) return false;
    if (badges[idx].unlocked) return false;
    const next = [...badges];
    next[idx] = { ...next[idx], unlocked: true, unlockedAt: Date.now() };
    set({ badges: next });
    return true;
  },

  resetAll() {
    set({ badges: initialBadges.map(b => ({ ...b, unlocked: false, unlockedAt: undefined })) });
  },

  mockUnlockNext() {
    const { badges } = get();
    const nextLocked = badges.find(b => !b.unlocked);
    if (!nextLocked) return null;
    get().unlock(nextLocked.id);
    return nextLocked.id;
  }
}));
