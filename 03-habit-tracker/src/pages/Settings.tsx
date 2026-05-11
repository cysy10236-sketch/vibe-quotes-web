import { useState, useRef } from 'react';
import { Sun, Moon, Monitor, Download, Upload, Trash2, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits } from '../contexts/HabitContext';
import { useCheckIns } from '../contexts/CheckInContext';
import { useAchievements } from '../contexts/AchievementContext';
import { exportData, importData } from '../utils/exportImport';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import type { Theme } from '../types';

const themes: { value: Theme; label: string; icon: typeof Sun; desc: string }[] = [
  { value: 'light', label: '明亮', icon: Sun, desc: '始终保持浅色模式' },
  { value: 'dark', label: '暗黑', icon: Moon, desc: '始终保持深色模式' },
  { value: 'system', label: '跟随系统', icon: Monitor, desc: '跟随系统主题设置自动切换' },
];

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { habits } = useHabits();
  const { checkIns } = useCheckIns();
  const { achievements } = useAchievements();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMsg, setImportMsg] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData({ version: 2, habits, checkIns, achievements });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      localStorage.setItem('habits', JSON.stringify(data.habits));
      localStorage.setItem('checkIns', JSON.stringify(data.checkIns));
      localStorage.setItem('achievements', JSON.stringify(data.achievements));
      setImportStatus('success');
      setImportMsg(`导入成功！${data.habits.length} 个习惯，${data.checkIns.length} 条记录。请刷新页面查看。`);
    } catch (err) {
      setImportStatus('error');
      setImportMsg(err instanceof Error ? err.message : '导入失败');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAll = () => {
    localStorage.removeItem('habits');
    localStorage.removeItem('checkIns');
    localStorage.removeItem('achievements');
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">设置</h2>

      {/* Theme */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">主题外观</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map(t => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                theme === t.value
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                theme === t.value
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                <t.icon size={20} />
              </div>
              <div className="text-left">
                <p className={`text-sm font-semibold ${theme === t.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-gray-100'}`}>
                  {t.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">数据管理</h3>

        <div className="space-y-3">
          {/* Export */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Download size={18} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">导出数据</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">将所有数据导出为 JSON 备份文件</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExport}>导出</Button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Upload size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">导入数据</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">从备份 JSON 文件恢复数据</p>
              </div>
            </div>
            <label className="cursor-pointer">
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                导入
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Import Status */}
          {importStatus !== 'idle' && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              importStatus === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            }`}>
              {importStatus === 'success'
                ? <CheckCircle2 size={16} />
                : <AlertTriangle size={16} />
              }
              {importMsg}
            </div>
          )}

          {/* Clear All */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">清除所有数据</p>
                <p className="text-xs text-red-500 dark:text-red-400">删除所有习惯、打卡记录和成就，此操作不可撤销</p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowClearConfirm(true)}>清除</Button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Info size={18} className="text-gray-400" />
          关于
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>应用名称</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">智能习惯追踪器</span>
          </div>
          <div className="flex justify-between">
            <span>版本</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>数据存储</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">本地浏览器 (LocalStorage)</span>
          </div>
          <div className="flex justify-between">
            <span>当前数据</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {habits.length} 习惯 · {checkIns.length} 记录 · {achievements.filter(a => !!a.unlockedAt).length} 成就
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="清除所有数据"
        message="此操作将永久删除所有习惯、打卡记录和成就数据，不可撤销。建议先导出备份。确定要继续吗？"
        confirmLabel="确认清除"
        variant="danger"
      />
    </div>
  );
}
