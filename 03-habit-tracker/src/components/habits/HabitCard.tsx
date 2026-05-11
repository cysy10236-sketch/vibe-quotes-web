import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Habit } from '../../types';
import { useCheckIns } from '../../contexts/CheckInContext';
import { useHabits } from '../../contexts/HabitContext';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const { toggleCheckIn, isCheckedIn, getStreak } = useCheckIns();
  const { deleteHabit } = useHabits();
  const [showDelete, setShowDelete] = useState(false);

  const checkedIn = isCheckedIn(habit.id);
  const streak = getStreak(habit.id);

  return (
    <>
      <div
        className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 transition-all hover:shadow-md"
        style={{ borderLeftWidth: '4px', borderLeftColor: habit.color }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleCheckIn(habit.id)}
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all cursor-pointer ${
              checkedIn
                ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-500 scale-105'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label={checkedIn ? '取消打卡' : '打卡'}
            title={checkedIn ? '取消打卡' : '完成打卡'}
          >
            {habit.icon}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${checkedIn ? 'line-through opacity-50' : ''}`}>
                {habit.name}
              </h3>
              {streak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                  🔥 {streak}天
                </span>
              )}
            </div>
            {habit.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{habit.description}</p>
            )}
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {habit.frequency === 'daily' ? '每天' : `每周${habit.targetDays}天`}
              </span>
              {checkedIn && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">✅ 今日已完成</span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(habit)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              aria-label="编辑习惯"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
              aria-label="删除习惯"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteHabit(habit.id)}
        title="删除习惯"
        message={`确定要删除「${habit.name}」吗？相关的打卡记录也会被保留但不再显示。此操作不可撤销。`}
        confirmLabel="删除"
        variant="danger"
      />
    </>
  );
}
