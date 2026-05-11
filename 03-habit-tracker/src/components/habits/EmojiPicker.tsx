import { useState } from 'react';

const emojiGroups: { label: string; emojis: string[] }[] = [
  { label: '运动', emojis: ['🏃', '🚴', '🏊', '🧘', '💪', '⚽', '🏀', '🎾', '🏋️', '🤸', '🎯', '🥊'] },
  { label: '学习', emojis: ['📚', '📖', '✍️', '🎓', '💡', '🧠', '📝', '💻', '🔬', '🎨', '🎹', '🗣️'] },
  { label: '生活', emojis: ['💤', '🥗', '💧', '🚭', '🍳', '🧹', '🌱', '💰', '📱', '☀️', '🌙', '🧴'] },
  { label: '心态', emojis: ['🧘', '🙏', '❤️', '😊', '🌟', '🎉', '🔥', '⭐', '✅', '🎯', '🏆', '💎'] },
];

const colors = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4',
  '#3b82f6', '#2563eb', '#6b7280',
];

interface EmojiPickerProps {
  selectedEmoji: string;
  selectedColor: string;
  onSelectEmoji: (emoji: string) => void;
  onSelectColor: (color: string) => void;
}

export function EmojiPicker({ selectedEmoji, selectedColor, onSelectEmoji, onSelectColor }: EmojiPickerProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">图标</label>
        <div className="flex gap-1 mb-3">
          {emojiGroups.map((g, i) => (
            <button
              key={g.label}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${
                i === activeTab
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-2">
          {emojiGroups[activeTab].emojis.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelectEmoji(emoji)}
              className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all cursor-pointer ${
                selectedEmoji === emoji
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500 scale-110'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">颜色</label>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => onSelectColor(color)}
              className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                selectedColor === color ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900 ring-gray-900 dark:ring-gray-100 scale-110' : ''
              }`}
              style={{ backgroundColor: color }}
              aria-label={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
