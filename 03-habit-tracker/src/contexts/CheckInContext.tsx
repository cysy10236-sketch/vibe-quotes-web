import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { CheckIn } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getDateString, calculateStreak, getTodayProgress, getHistoryData } from '../utils/streak';
import { useHabits } from './HabitContext';

interface CheckInContextType {
  checkIns: CheckIn[];
  toggleCheckIn: (habitId: string) => void;
  isCheckedIn: (habitId: string) => boolean;
  getStreak: (habitId: string) => number;
  getTodayStats: () => { completed: number; total: number; percentage: number };
  getHistory: (days: number) => { date: string; completed: number; total: number }[];
}

const CheckInContext = createContext<CheckInContextType | null>(null);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [checkIns, setCheckIns] = useLocalStorage<CheckIn[]>('checkIns', []);
  const { habits } = useHabits();

  const toggleCheckIn = useCallback((habitId: string) => {
    const today = getDateString();
    setCheckIns(prev => {
      const existing = prev.find(c => c.habitId === habitId && c.date === today);
      if (existing) {
        return prev.map(c =>
          c.habitId === habitId && c.date === today
            ? { ...c, completed: !c.completed }
            : c
        );
      }
      return [...prev, { habitId, date: today, completed: true }];
    });
  }, [setCheckIns]);

  const isCheckedIn = useCallback((habitId: string) => {
    const today = getDateString();
    return checkIns.some(c => c.habitId === habitId && c.date === today && c.completed);
  }, [checkIns]);

  const getStreak = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    return calculateStreak(habit, checkIns);
  }, [habits, checkIns]);

  const getTodayStats = useCallback(() => {
    return getTodayProgress(habits, checkIns);
  }, [habits, checkIns]);

  const getHistory = useCallback((days: number) => {
    return getHistoryData(days, habits, checkIns);
  }, [habits, checkIns]);

  return (
    <CheckInContext.Provider value={{ checkIns, toggleCheckIn, isCheckedIn, getStreak, getTodayStats, getHistory }}>
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIns() {
  const ctx = useContext(CheckInContext);
  if (!ctx) throw new Error('useCheckIns must be used within CheckInProvider');
  return ctx;
}
