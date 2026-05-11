import type { CheckIn, Habit } from '../types';

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function getDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return getDateString(d);
}

export function calculateStreak(habit: Habit, checkIns: CheckIn[]): number {
  const today = getDateString();
  const habitCheckIns = checkIns.filter(c => c.habitId === habit.id && c.completed);
  const dates = [...new Set(habitCheckIns.map(c => c.date))].sort().reverse();

  if (dates.length === 0) return 0;

  const todayChecked = dates[0] === today;
  const yesterday = getDaysAgo(1);
  const yesterdayChecked = dates[0] === yesterday;

  if (!todayChecked && !yesterdayChecked) return 0;

  let streak = 0;
  for (let i = 0; i < dates.length; i++) {
    const expected = getDaysAgo(streak);
    if (dates[i] === expected) {
      streak++;
    } else if (i === 0 && dates[i] !== expected) {
      break;
    } else {
      break;
    }
  }

  return streak;
}

export function getTodayProgress(
  habits: Habit[],
  checkIns: CheckIn[]
): { completed: number; total: number; percentage: number } {
  const today = getDateString();
  const total = habits.length;
  const completed = checkIns.filter(c => c.date === today && c.completed).length;
  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getHistoryData(
  days: number,
  habits: Habit[],
  checkIns: CheckIn[]
): { date: string; completed: number; total: number }[] {
  const result: { date: string; completed: number; total: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = getDaysAgo(i);
    const total = habits.filter(h => {
      const created = new Date(h.createdAt);
      const target = new Date(date);
      return created <= target;
    }).length;
    const completed = checkIns.filter(c => c.date === date && c.completed).length;
    result.push({ date, completed, total });
  }
  return result;
}

export function getTotalCheckIns(checkIns: CheckIn[]): number {
  return checkIns.filter(c => c.completed).length;
}
