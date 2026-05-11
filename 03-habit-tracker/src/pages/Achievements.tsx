import { useEffect, useState } from 'react';
import { Trophy, Lock, Sparkles } from 'lucide-react';
import { useAchievements } from '../contexts/AchievementContext';
import type { Achievement } from '../types';

function AchievementBadge({ achievement, onClick }: { achievement: Achievement; onClick: () => void }) {
  const unlocked = !!achievement.unlockedAt;

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
        unlocked
          ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-md hover:scale-[1.02]'
          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800/50 opacity-60'
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
          unlocked
            ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30'
            : 'bg-gray-200 dark:bg-gray-800 grayscale'
        }`}
      >
        {unlocked ? achievement.icon : <Lock size={24} className="text-gray-400" />}
      </div>
      <p className={`text-sm font-semibold text-center ${unlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
        {achievement.name}
      </p>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
        {achievement.description}
      </p>
      {unlocked && achievement.unlockedAt && (
        <p className="text-[10px] text-yellow-600 dark:text-yellow-400">
          解锁于 {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
        </p>
      )}
    </button>
  );
}

export function Achievements() {
  const { achievements, recentlyUnlocked, clearRecent } = useAchievements();
  const [detail, setDetail] = useState<Achievement | null>(null);

  useEffect(() => {
    if (recentlyUnlocked) {
      const timer = setTimeout(() => clearRecent(), 6000);
      return () => clearTimeout(timer);
    }
  }, [recentlyUnlocked, clearRecent]);

  const unlocked = achievements.filter(a => !!a.unlockedAt);
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">成就徽章</h2>

      {/* Recently Unlocked Toast */}
      {recentlyUnlocked && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5 flex items-center gap-4 animate-bounce-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 flex items-center justify-center text-2xl flex-shrink-0">
            <Sparkles size={24} className="text-yellow-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
              成就解锁！
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {recentlyUnlocked.icon} {recentlyUnlocked.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recentlyUnlocked.description}
            </p>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">收集进度</h3>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {unlocked.length} / {achievements.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
            style={{ width: `${achievements.length > 0 ? (unlocked.length / achievements.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Trophy size={16} className="text-yellow-500" />
            已解锁 ({unlocked.length})
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {unlocked.map(a => (
              <AchievementBadge key={a.id} achievement={a} onClick={() => setDetail(a)} />
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
            <Lock size={16} />
            未解锁 ({locked.length})
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {locked.map(a => (
              <AchievementBadge key={a.id} achievement={a} onClick={() => setDetail(a)} />
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-sm w-full p-6 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 flex items-center justify-center text-4xl mb-4">
              {detail.unlockedAt ? detail.icon : <Lock size={32} className="text-gray-400" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{detail.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{detail.description}</p>
            {detail.unlockedAt ? (
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                解锁于 {new Date(detail.unlockedAt).toLocaleDateString('zh-CN')}
              </p>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">尚未解锁，继续加油！</p>
            )}
            <button
              onClick={() => setDetail(null)}
              className="mt-6 px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 cursor-pointer transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
