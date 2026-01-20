export type Priority = 'hail-mary' | 'red-zone' | 'first-down' | 'practice';
export type Category = 'work' | 'school' | 'personal' | 'health' | 'other';
export type CompletionStatus = 'touchdown' | 'field-goal' | 'turnover';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  deadline: string; // ISO date string
  priority: Priority;
  category: Category;
  isCompleted: boolean;
  completedAt?: string; // ISO date string
  completionStatus?: CompletionStatus;
  notifyBefore?: number; // Minutes before deadline
  createdAt: string; // ISO date string
}

export interface Stats {
  touchdowns: number; // Completed on time
  fieldGoals: number; // Completed late
  turnovers: number; // Missed deadlines
  currentStreak: number; // Consecutive touchdowns
  bestStreak: number;
  totalPlays: number;
}

export interface ReminderContextType {
  reminders: Reminder[];
  stats: Stats;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  getUpcomingReminders: () => Reminder[];
  getCompletedReminders: () => Reminder[];
  getOverdueReminders: () => Reminder[];
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bgColor: string; description: string }> = {
  'hail-mary': {
    label: 'Hail Mary',
    color: 'text-danger-500',
    bgColor: 'bg-danger-500/20',
    description: 'Critical - Must complete!'
  },
  'red-zone': {
    label: 'Red Zone',
    color: 'text-warning-500',
    bgColor: 'bg-warning-500/20',
    description: 'High priority'
  },
  'first-down': {
    label: 'First Down',
    color: 'text-primary-400',
    bgColor: 'bg-primary-400/20',
    description: 'Normal priority'
  },
  'practice': {
    label: 'Practice',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20',
    description: 'Low priority'
  }
};

export const CATEGORY_CONFIG: Record<Category, { label: string; icon: string; color: string }> = {
  work: { label: 'Work', icon: '💼', color: 'text-primary-400' },
  school: { label: 'School', icon: '📚', color: 'text-field-400' },
  personal: { label: 'Personal', icon: '🏠', color: 'text-leather-400' },
  health: { label: 'Health', icon: '💪', color: 'text-danger-500' },
  other: { label: 'Other', icon: '📌', color: 'text-gray-400' }
};
