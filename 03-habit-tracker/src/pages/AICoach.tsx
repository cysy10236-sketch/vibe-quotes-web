import { useState, useMemo } from 'react';
import { Bot, Send, Lightbulb, ListChecks, Bookmark, Sparkles } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import { generateCoachAdvice, getCategoryName } from '../utils/aiCoach';
import { Button } from '../components/ui/Button';
import type { CoachAdvice } from '../types';

export function AICoach() {
  const { habits } = useHabits();
  const [habitName, setHabitName] = useState('');
  const [advice, setAdvice] = useState<CoachAdvice | null>(null);

  const handleGenerate = () => {
    const name = habitName.trim();
    if (!name) return;
    setAdvice(generateCoachAdvice(name));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate();
  };

  const existingHabitNames = useMemo(() => habits.map(h => h.name), [habits]);

  if (advice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Bot size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI 习惯教练</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              分类：{getCategoryName(advice.habitName)} · 「{advice.habitName}」
            </p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-yellow-500" />
            养成策略
          </h3>
          <div className="space-y-3">
            {advice.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-950">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
            <ListChecks size={18} className="text-green-500" />
            四周行动方案
          </h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-100 dark:bg-indigo-900/30" />
            <div className="space-y-4">
              {advice.actionPlan.map((step) => (
                <div key={step.step} className="flex items-start gap-4 relative">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center z-10">
                    {step.step}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 pt-1.5 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expert Tip */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl border border-indigo-200 dark:border-indigo-800 p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
              {advice.tip}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => { setAdvice(null); setHabitName(''); }}>
            重新查询
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI 习惯教练</h2>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Bot size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">习惯养成建议</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">输入你想养成的习惯，获取个性化培养方案</p>
          </div>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            type="text"
            value={habitName}
            onChange={e => setHabitName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="例如：每天跑步、阅读、冥想..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            autoFocus
          />
          <Button onClick={handleGenerate} size="lg" disabled={!habitName.trim()}>
            <Send size={18} />
            生成
          </Button>
        </div>

        {existingHabitNames.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
              <Bookmark size={12} />
              快速选择已有习惯：
            </p>
            <div className="flex flex-wrap gap-2">
              {existingHabitNames.map(name => (
                <button
                  key={name}
                  onClick={() => {
                    setHabitName(name);
                    setAdvice(generateCoachAdvice(name));
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">AI 教练能帮你什么？</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: '🔍', title: '智能分类', desc: '自动识别习惯类型，匹配针对性建议' },
            { icon: '📋', title: '行动方案', desc: '四周分步计划，从易到难逐步推进' },
            { icon: '💡', title: '科学方法', desc: '基于行为心理学研究的养成策略' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-2">
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
