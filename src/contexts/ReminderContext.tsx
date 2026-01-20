import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isBefore, parseISO } from 'date-fns';
import type { Reminder, Stats, ReminderContextType, CompletionStatus } from '../lib/types';
import { getStoredReminders, setStoredReminders, getStoredStats, setStoredStats } from '../lib/storage';

const ReminderContext = createContext<ReminderContextType | null>(null);

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>(() => getStoredReminders());
  const [stats, setStats] = useState<Stats>(() => getStoredStats());

  // Persist reminders to localStorage
  useEffect(() => {
    setStoredReminders(reminders);
  }, [reminders]);

  // Persist stats to localStorage
  useEffect(() => {
    setStoredStats(stats);
  }, [stats]);

  // Check for overdue reminders periodically
  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      setReminders(prev => {
        let hasChanges = false;
        const updated = prev.map(reminder => {
          if (!reminder.isCompleted && isBefore(parseISO(reminder.deadline), now)) {
            // Mark as turnover (missed)
            hasChanges = true;
            return {
              ...reminder,
              isCompleted: true,
              completedAt: now.toISOString(),
              completionStatus: 'turnover' as CompletionStatus
            };
          }
          return reminder;
        });

        if (hasChanges) {
          // Update stats for turnovers
          const newTurnovers = updated.filter(
            r => r.completionStatus === 'turnover' &&
            !prev.find(p => p.id === r.id)?.completionStatus
          ).length;

          if (newTurnovers > 0) {
            setStats(s => ({
              ...s,
              turnovers: s.turnovers + newTurnovers,
              currentStreak: 0 // Reset streak on turnover
            }));
          }
        }

        return hasChanges ? updated : prev;
      });
    };

    checkOverdue();
    const interval = setInterval(checkOverdue, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const addReminder = useCallback((reminderData: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      isCompleted: false
    };
    setReminders(prev => [...prev, newReminder]);
    setStats(s => ({ ...s, totalPlays: s.totalPlays + 1 }));
  }, []);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const completeReminder = useCallback((id: string) => {
    const now = new Date();

    setReminders(prev => {
      const reminder = prev.find(r => r.id === id);
      if (!reminder || reminder.isCompleted) return prev;

      const deadline = parseISO(reminder.deadline);
      const isOnTime = isBefore(now, deadline);
      const status: CompletionStatus = isOnTime ? 'touchdown' : 'field-goal';

      // Update stats
      setStats(s => {
        const newStreak = isOnTime ? s.currentStreak + 1 : 0;
        return {
          ...s,
          touchdowns: isOnTime ? s.touchdowns + 1 : s.touchdowns,
          fieldGoals: isOnTime ? s.fieldGoals : s.fieldGoals + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(s.bestStreak, newStreak)
        };
      });

      return prev.map(r => r.id === id ? {
        ...r,
        isCompleted: true,
        completedAt: now.toISOString(),
        completionStatus: status
      } : r);
    });
  }, []);

  const getUpcomingReminders = useCallback(() => {
    return reminders
      .filter(r => !r.isCompleted)
      .sort((a, b) => parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime());
  }, [reminders]);

  const getCompletedReminders = useCallback(() => {
    return reminders
      .filter(r => r.isCompleted)
      .sort((a, b) => {
        const aTime = a.completedAt ? parseISO(a.completedAt).getTime() : 0;
        const bTime = b.completedAt ? parseISO(b.completedAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [reminders]);

  const getOverdueReminders = useCallback(() => {
    const now = new Date();
    return reminders.filter(r => !r.isCompleted && isBefore(parseISO(r.deadline), now));
  }, [reminders]);

  return (
    <ReminderContext.Provider value={{
      reminders,
      stats,
      addReminder,
      updateReminder,
      deleteReminder,
      completeReminder,
      getUpcomingReminders,
      getCompletedReminders,
      getOverdueReminders
    }}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders() {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
}
