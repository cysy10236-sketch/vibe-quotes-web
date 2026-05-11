export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  targetDays: number;
  icon: string;
  color: string;
  createdAt: string;
  order: number;
}

export interface CheckIn {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (data: { habits: Habit[]; checkIns: CheckIn[] }) => boolean;
}

export interface Achievement extends AchievementDef {
  unlockedAt: string | null;
}

export interface AppData {
  version: number;
  habits: Habit[];
  checkIns: CheckIn[];
  achievements: Achievement[];
}

export interface CoachAdvice {
  habitName: string;
  suggestions: string[];
  actionPlan: { step: number; description: string }[];
  tip: string;
}

export type Theme = 'light' | 'dark' | 'system';
