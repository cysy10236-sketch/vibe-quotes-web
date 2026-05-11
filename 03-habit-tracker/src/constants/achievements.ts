import type { AchievementDef, Habit, CheckIn } from '../types';
import { getDateString, getTotalCheckIns } from '../utils/streak';

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: 'first_habit',
    name: '新手入门',
    description: '创建你的第一个习惯',
    icon: '🎯',
    condition: (data: { habits: Habit[] }) => data.habits.length >= 1,
  },
  {
    id: 'streak_7',
    name: '连续7天',
    description: '任意习惯达到7天连续打卡',
    icon: '🔥',
    condition: (data: { habits: Habit[]; checkIns: CheckIn[] }) => {
      return data.habits.some(h => {
        const habitCheckIns = data.checkIns
          .filter(c => c.habitId === h.id && c.completed)
          .map(c => c.date);
        const dates = [...new Set(habitCheckIns)].sort().reverse();
        if (dates.length === 0) return false;
        const today = getDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (dates[0] !== today && dates[0] !== yesterdayStr) return false;
        let streak = 0;
        for (let i = 0; i < dates.length; i++) {
          const d = new Date();
          d.setDate(d.getDate() - streak);
          if (dates[i] === d.toISOString().split('T')[0]) {
            streak++;
          } else {
            break;
          }
        }
        return streak >= 7;
      });
    },
  },
  {
    id: 'streak_30',
    name: '坚持一个月',
    description: '任意习惯达到30天连续打卡',
    icon: '💪',
    condition: (data: { habits: Habit[]; checkIns: CheckIn[] }) => {
      return data.habits.some(h => {
        const habitCheckIns = data.checkIns
          .filter(c => c.habitId === h.id && c.completed)
          .map(c => c.date);
        const dates = [...new Set(habitCheckIns)].sort().reverse();
        if (dates.length === 0) return false;
        const today = getDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (dates[0] !== today && dates[0] !== yesterdayStr) return false;
        let streak = 0;
        for (let i = 0; i < dates.length; i++) {
          const d = new Date();
          d.setDate(d.getDate() - streak);
          if (dates[i] === d.toISOString().split('T')[0]) {
            streak++;
          } else {
            break;
          }
        }
        return streak >= 30;
      });
    },
  },
  {
    id: 'perfect_week',
    name: '完美一周',
    description: '连续7天完成所有习惯的打卡',
    icon: '📊',
    condition: (data: { habits: Habit[]; checkIns: CheckIn[] }) => {
      const { habits, checkIns } = data;
      if (habits.length === 0) return false;
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const allDone = habits.every(h =>
          checkIns.some(c => c.habitId === h.id && c.date === dateStr && c.completed)
        );
        if (!allDone) return false;
      }
      return true;
    },
  },
  {
    id: 'master_100',
    name: '习惯大师',
    description: '累计完成100次打卡',
    icon: '🏆',
    condition: (data: { checkIns: CheckIn[] }) => getTotalCheckIns(data.checkIns) >= 100,
  },
  {
    id: 'multitasker',
    name: '多面手',
    description: '同时维护5个习惯',
    icon: '🌟',
    condition: (data: { habits: Habit[] }) => data.habits.length >= 5,
  },
];
