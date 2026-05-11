import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useCheckIns } from '../../contexts/CheckInContext';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { getTodayStats } = useCheckIns();
  const stats = getTodayStats();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
            智能习惯追踪器
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {stats.total > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              今日 <span className="font-semibold text-indigo-600 dark:text-indigo-400">{stats.completed}</span>/{stats.total}
            </div>
          )}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-pointer transition-colors"
            aria-label="切换主题"
            title={theme === 'light' ? '明亮模式' : theme === 'dark' ? '暗黑模式' : '跟随系统'}
          >
            <ThemeIcon size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
