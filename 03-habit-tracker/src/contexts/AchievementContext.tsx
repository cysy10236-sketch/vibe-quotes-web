import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Achievement } from '../types';
import { ACHIEVEMENT_DEFS } from '../constants/achievements';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useHabits } from './HabitContext';
import { useCheckIns } from './CheckInContext';

interface AchievementContextType {
  achievements: Achievement[];
  recentlyUnlocked: Achievement | null;
  clearRecent: () => void;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(
    'achievements',
    ACHIEVEMENT_DEFS.map(def => ({ ...def, unlockedAt: null }))
  );
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Achievement | null>(null);
  const { habits } = useHabits();
  const { checkIns } = useCheckIns();

  const checkAndUnlock = useCallback(() => {
    setAchievements(prev => {
      let changed = false;
      const updated = prev.map(a => {
        if (a.unlockedAt) return a;
        const condition = ACHIEVEMENT_DEFS.find(d => d.id === a.id)?.condition;
        if (condition && condition({ habits, checkIns })) {
          changed = true;
          const unlocked: Achievement = { ...a, unlockedAt: new Date().toISOString() };
          setRecentlyUnlocked(unlocked);
          return unlocked;
        }
        return a;
      });
      return changed ? updated : prev;
    });
  }, [habits, checkIns, setAchievements]);

  useEffect(() => {
    checkAndUnlock();
  }, [habits, checkIns]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearRecent = useCallback(() => setRecentlyUnlocked(null), []);

  return (
    <AchievementContext.Provider value={{ achievements, recentlyUnlocked, clearRecent }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider');
  return ctx;
}
