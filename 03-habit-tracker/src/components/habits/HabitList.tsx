import type { Habit } from '../../types';
import { useHabits } from '../../contexts/HabitContext';
import { HabitCard } from './HabitCard';
import { Button } from '../ui/Button';
import { Plus, ClipboardList } from 'lucide-react';

interface HabitListProps {
  onAdd: () => void;
  onEdit: (habit: Habit) => void;
}

export function HabitList({ onAdd, onEdit }: HabitListProps) {
  const { habits } = useHabits();

  if (habits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
          <ClipboardList size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">还没有习惯</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          创建你的第一个习惯，开始追踪每天的进步。从小事做起，积少成多。
        </p>
        <Button onClick={onAdd} size="lg">
          <Plus size={20} />
          创建习惯
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits
        .sort((a, b) => a.order - b.order)
        .map(habit => (
          <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
        ))}
    </div>
  );
}
