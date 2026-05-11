import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { Habit } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface HabitContextType {
  habits: Habit[];
  addHabit: (data: Omit<Habit, 'id' | 'createdAt' | 'order'>) => void;
  updateHabit: (id: string, data: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  reorderHabits: (fromIndex: number, toIndex: number) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);

  const addHabit = useCallback((data: Omit<Habit, 'id' | 'createdAt' | 'order'>) => {
    setHabits(prev => [
      ...prev,
      {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        order: prev.length,
      },
    ]);
  }, [setHabits]);

  const updateHabit = useCallback((id: string, data: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...data } : h)));
  }, [setHabits]);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, [setHabits]);

  const reorderHabits = useCallback((fromIndex: number, toIndex: number) => {
    setHabits(prev => {
      const items = [...prev];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return items.map((h, i) => ({ ...h, order: i }));
    });
  }, [setHabits]);

  return (
    <HabitContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, reorderHabits }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
