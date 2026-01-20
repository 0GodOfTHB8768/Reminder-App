import type { Reminder, Stats } from './types';

const STORAGE_KEYS = {
  REMINDERS: 'gameday-reminders',
  STATS: 'gameday-stats',
  NOTIFICATION_PERMISSION: 'gameday-notification-permission'
} as const;

const DEFAULT_STATS: Stats = {
  touchdowns: 0,
  fieldGoals: 0,
  turnovers: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalPlays: 0
};

export function getStoredReminders(): Reminder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    console.error('Failed to parse stored reminders');
    return [];
  }
}

export function setStoredReminders(reminders: Reminder[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (error) {
    console.error('Failed to store reminders:', error);
  }
}

export function getStoredStats(): Stats {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS);
    return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
  } catch {
    console.error('Failed to parse stored stats');
    return DEFAULT_STATS;
  }
}

export function setStoredStats(stats: Stats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to store stats:', error);
  }
}

export function getNotificationPermission(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PERMISSION);
    return stored === 'true';
  } catch {
    return false;
  }
}

export function setNotificationPermission(granted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PERMISSION, String(granted));
  } catch (error) {
    console.error('Failed to store notification permission:', error);
  }
}
