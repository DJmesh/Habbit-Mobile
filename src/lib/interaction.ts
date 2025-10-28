import { useAchievements } from '@/store/achievements';

export function tap() {
  useAchievements.getState().recordInteraction();
}
