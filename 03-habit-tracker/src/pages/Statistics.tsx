import { useMemo } from 'react';
import { Flame, CheckCircle2, CalendarDays, TrendingUp } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import { useCheckIns } from '../contexts/CheckInContext';
import { getTotalCheckIns } from '../utils/streak';

function HistoryChart({ data }: { data: { date: string; completed: number; total: number }[] }) {
  const maxVal = Math.max(1, ...data.map(d => d.total));
  const bars = data.slice(-30);

  return (
    <div className="flex items-end gap-1 h-32">
      {bars.map((d, i) => {
        const heightPct = d.total > 0 ? (d.completed / maxVal) * 100 : 0;
        const bg = d.total > 0 && d.completed === d.total && d.total > 0
          ? 'bg-green-400 dark:bg-green-500'
          : d.completed > 0
            ? 'bg-indigo-400 dark:bg-indigo-500'
            : 'bg-gray-200 dark:bg-gray-700';
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className={`w-full rounded-sm transition-all hover:opacity-80 ${bg}`}
              style={{ height: `${Math.max(2, (heightPct / 100) * 128)}px` }}
              title={`${d.date}: ${d.completed}/${d.total}`}
            />
            {bars.length <= 15 && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 rotate-45 origin-left translate-x-1">
                {d.date.slice(5)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Statistics() {
  const { habits } = useHabits();
  const { getHistory, getStreak, checkIns } = useCheckIns();

  const history = useMemo(() => getHistory(30), [getHistory]);
  const totalCheckIns = useMemo(() => getTotalCheckIns(checkIns), [checkIns]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCompleted = checkIns.filter(c => c.date === todayStr && c.completed).length;

  const bestStreakHabit = useMemo(() => {
    return habits.reduce<{ name: string; icon: string; streak: number } | null>((best, h) => {
      const s = getStreak(h.id);
      if (!best || s > best.streak) return { name: h.name, icon: h.icon, streak: s };
      return best;
    }, null);
  }, [habits, getStreak]);

  const sortedHabits = useMemo(() => {
    return habits
      .map(h => {
        const habitCheckIns = checkIns.filter(c => c.habitId === h.id && c.completed);
        const streak = getStreak(h.id);
        const rate = checkIns.filter(c => c.habitId === h.id).length > 0
          ? Math.round((habitCheckIns.length / checkIns.filter(c => c.habitId === h.id).length) * 100)
          : 0;
        return { ...h, streak, total: habitCheckIns.length, rate };
      })
      .sort((a, b) => b.streak - a.streak || b.total - a.total);
  }, [habits, checkIns, getStreak]);

  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">统计面板</h2>
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
            <TrendingUp size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">暂无数据</h3>
          <p className="text-gray-500 dark:text-gray-400">添加一些习惯并打卡后，这里将显示你的统计数据。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">统计面板</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">累计打卡</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCheckIns}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Flame size={16} className="text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">最佳连续</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {bestStreakHabit ? `${bestStreakHabit.streak}天` : '—'}
          </p>
          {bestStreakHabit && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {bestStreakHabit.icon} {bestStreakHabit.name}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CalendarDays size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">今日完成</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {todayCompleted}/{habits.length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">习惯数量</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{habits.length}</p>
        </div>
      </div>

      {/* History Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">打卡趋势（近30天）</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">每根柱子代表一天，绿色=全部完成，紫色=部分完成，灰色=未打卡</p>
        <HistoryChart data={history} />
      </div>

      {/* Habit Ranking */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">习惯排行榜</h3>
        <div className="space-y-2">
          {sortedHabits.map((h, i) => (
            <div
              key={h.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-950"
            >
              <span className={`text-sm font-bold w-6 text-center ${
                i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-500'
              }`}>
                {i + 1}
              </span>
              <span className="text-xl">{h.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{h.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  累计 {h.total} 次打卡 · 完成率 {h.rate}%
                </p>
              </div>
              {h.streak > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 flex-shrink-0">
                  🔥 {h.streak}天
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
