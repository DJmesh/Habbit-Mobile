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
  interactions: number;
  lastUnlockedId: string | null;
  recordInteraction: () => void;
  unlock: (id: string) => boolean;
  resetAll: () => void;
  clearLastUnlocked: () => void;
  mockUnlockNext: () => string | null;
};

const interactionBadges: Badge[] = [
  {
    id: 'first_touch',
    title: 'Primeiro Toque',
    description: 'Você realizou sua primeira ação no app!',
    icon: 'trophy',
    color: '#2EAAB0',
    accent: '#7C4DFF',
    unlocked: false,
  },
  {
    id: 'interact_5',
    title: 'Ritmo Iniciado',
    description: 'Você realizou 5 interações!',
    icon: 'star',
    color: '#FFC107',
    accent: '#FF7043',
    unlocked: false,
  },
  {
    id: 'interact_10',
    title: 'Em Ascensão',
    description: 'Você realizou 10 interações!',
    icon: 'flame',
    color: '#FF5252',
    accent: '#FFAB40',
    unlocked: false,
  },
  {
    id: 'interact_15',
    title: 'Constante e Firme',
    description: 'Você realizou 15 interações!',
    icon: 'diamond',
    color: '#00C853',
    accent: '#00BFA5',
    unlocked: false,
  },
];

const ruleBadges: Badge[] = [
  {
    id: 'daily_3',
    title: 'Trio do Dia',
    description: 'Complete 3 hábitos em um único dia.',
    icon: 'star',
    color: '#FFC107',
    accent: '#FF7043',
    unlocked: false,
  },
  {
    id: 'streak_3',
    title: 'Sequência de 3 Dias',
    description: 'Mantenha uma sequência de 3 dias.',
    icon: 'flame',
    color: '#FF5252',
    accent: '#FFAB40',
    unlocked: false,
  },
  {
    id: 'focused',
    title: 'Mente Focada',
    description: 'Registre um hábito 7 vezes na semana.',
    icon: 'diamond',
    color: '#00C853',
    accent: '#00BFA5',
    unlocked: false,
  },
  {
    id: 'champion',
    title: 'Campeão',
    description: 'Conclua todas as metas do dia.',
    icon: 'medal',
    color: '#42A5F5',
    accent: '#1DE9B6',
    unlocked: false,
  },
];

const initialBadges: Badge[] = [...interactionBadges, ...ruleBadges];

export const useAchievements = create<AchievementsState>((set, get) => ({
  badges: initialBadges,
  interactions: 0,
  lastUnlockedId: null,

  recordInteraction() {
    const current = get().interactions + 1;
    const thresholds: Record<number, string> = {
      1: 'first_touch',
      5: 'interact_5',
      10: 'interact_10',
      15: 'interact_15',
    };
    let justUnlocked: string | null = null;
    const badgeId = thresholds[current];
    if (badgeId) {
      const ok = get().unlock(badgeId);
      if (ok) justUnlocked = badgeId;
    }
    set({ interactions: current, lastUnlockedId: justUnlocked ?? get().lastUnlockedId });
  },

  unlock(id) {
    const { badges } = get();
    const idx = badges.findIndex(b => b.id === id);
    if (idx < 0 || badges[idx].unlocked) return false;
    const next = [...badges];
    next[idx] = { ...next[idx], unlocked: true, unlockedAt: Date.now() };
    set({ badges: next, lastUnlockedId: id });
    return true;
  },

  resetAll() {
    set({
      badges: initialBadges.map(b => ({ ...b, unlocked: false, unlockedAt: undefined })),
      interactions: 0,
      lastUnlockedId: null,
    });
  },

  clearLastUnlocked() {
    set({ lastUnlockedId: null });
  },

  mockUnlockNext() {
    const { badges } = get();
    const nextLocked = badges.find(b => !b.unlocked);
    if (!nextLocked) return null;
    get().unlock(nextLocked.id);
    return nextLocked.id;
  },
}));
