import { useState } from 'react';
import type { Habit } from '../../types';
import { EmojiPicker } from './EmojiPicker';
import { Button } from '../ui/Button';

interface HabitFormProps {
  onSubmit: (data: Omit<Habit, 'id' | 'createdAt' | 'order'>) => void;
  onCancel: () => void;
  initial?: Habit;
}

export function HabitForm({ onSubmit, onCancel, initial }: HabitFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(initial?.frequency ?? 'daily');
  const [targetDays, setTargetDays] = useState(initial?.targetDays ?? 1);
  const [icon, setIcon] = useState(initial?.icon ?? '🎯');
  const [color, setColor] = useState(initial?.color ?? '#6366f1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      frequency,
      targetDays,
      icon,
      color,
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          习惯名称 *
        </label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="例如：每天跑步"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          autoFocus
          required
        />
      </div>

      <div>
        <label htmlFor="habit-desc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          描述
        </label>
        <input
          id="habit-desc"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="简短描述这个习惯（可选）"
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">频率</label>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value as 'daily' | 'weekly')}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="daily">每天</option>
            <option value="weekly">每周</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {frequency === 'daily' ? '目标次数/天' : '目标天数/周'}
          </label>
          <input
            type="number"
            min={1}
            max={frequency === 'daily' ? 1 : 7}
            value={targetDays}
            onChange={e => setTargetDays(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <EmojiPicker
        selectedEmoji={icon}
        selectedColor={color}
        onSelectEmoji={setIcon}
        onSelectColor={setColor}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>取消</Button>
        <Button type="submit">{initial ? '保存修改' : '添加习惯'}</Button>
      </div>
    </form>
  );
}
