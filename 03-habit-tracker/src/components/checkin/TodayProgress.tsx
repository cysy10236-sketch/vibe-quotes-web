import { useCheckIns } from '../../contexts/CheckInContext';

export function TodayProgress() {
  const { getTodayStats } = useCheckIns();
  const { completed, total, percentage } = getTodayStats();

  if (total === 0) return null;

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div className="flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" className="-rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-800"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-indigo-500 dark:text-indigo-400 transition-all duration-700 ease-out"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{percentage}%</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">今日进度</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            已完成 <span className="font-semibold text-indigo-600 dark:text-indigo-400">{completed}</span> / {total} 个习惯
          </p>
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          {percentage === 100 && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
              🎉 全部完成！太棒了！
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
