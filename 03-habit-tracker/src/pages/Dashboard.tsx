import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Habit } from '../types';
import { useHabits } from '../contexts/HabitContext';
import { HabitList } from '../components/habits/HabitList';
import { HabitForm } from '../components/habits/HabitForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const { habits, addHabit, updateHabit } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleSubmit = (data: Omit<Habit, 'id' | 'createdAt' | 'order'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">今日习惯</h2>
          {habits.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {habits.length} 个习惯 · 点击图标打卡
            </p>
          )}
        </div>
        {habits.length > 0 && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus size={18} />
            添加习惯
          </Button>
        )}
      </div>

      <HabitList onAdd={() => setShowForm(true)} onEdit={handleEdit} />

      <Modal
        open={showForm}
        onClose={handleClose}
        title={editingHabit ? '编辑习惯' : '添加新习惯'}
      >
        <HabitForm
          onSubmit={handleSubmit}
          onCancel={handleClose}
          initial={editingHabit ?? undefined}
        />
      </Modal>
    </div>
  );
}
