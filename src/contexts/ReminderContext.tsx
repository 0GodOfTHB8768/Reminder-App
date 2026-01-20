import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isBefore, parseISO } from 'date-fns';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch,
} from 'firebase/firestore';
import type { Reminder, Stats, ReminderContextType, CompletionStatus } from '../lib/types';
import { getStoredReminders, setStoredReminders, getStoredStats, setStoredStats } from '../lib/storage';
import { db, COLLECTIONS } from '../lib/firebase';
import { useAuth } from './AuthContext';

const ReminderContext = createContext<ReminderContextType | null>(null);

const DEFAULT_STATS: Stats = {
  touchdowns: 0,
  fieldGoals: 0,
  turnovers: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalPlays: 0,
};

export function ReminderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSyncedLocal, setHasSyncedLocal] = useState(false);

  // Load initial data based on auth state
  useEffect(() => {
    if (user && db) {
      // User is logged in - listen to Firestore
      setIsLoading(true);

      const remindersRef = collection(db, COLLECTIONS.USERS, user.uid, COLLECTIONS.REMINDERS);
      const q = query(remindersRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const firestoreReminders: Reminder[] = [];
        snapshot.forEach((doc) => {
          firestoreReminders.push({ id: doc.id, ...doc.data() } as Reminder);
        });

        // On first sync, merge local reminders to cloud if any exist
        if (!hasSyncedLocal) {
          const localReminders = getStoredReminders();
          const localStats = getStoredStats();

          if (localReminders.length > 0 && firestoreReminders.length === 0) {
            // User has local data but no cloud data - sync local to cloud
            syncLocalToCloud(user.uid, localReminders, localStats);
            setReminders(localReminders);
            setStats(localStats);
          } else {
            // Use cloud data
            setReminders(firestoreReminders);
            // Recalculate stats from reminders
            const calculatedStats = calculateStats(firestoreReminders);
            setStats(calculatedStats);
          }
          setHasSyncedLocal(true);
        } else {
          setReminders(firestoreReminders);
          const calculatedStats = calculateStats(firestoreReminders);
          setStats(calculatedStats);
        }

        setIsLoading(false);
      }, (error) => {
        console.error('Firestore subscription error:', error);
        // Fall back to local storage on error
        setReminders(getStoredReminders());
        setStats(getStoredStats());
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      // No user - use localStorage
      setReminders(getStoredReminders());
      setStats(getStoredStats());
      setIsLoading(false);
      setHasSyncedLocal(false);
    }
  }, [user, hasSyncedLocal]);

  // Persist to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      setStoredReminders(reminders);
    }
  }, [reminders, user]);

  useEffect(() => {
    if (!user) {
      setStoredStats(stats);
    }
  }, [stats, user]);

  // Calculate stats from reminders
  const calculateStats = (reminderList: Reminder[]): Stats => {
    const completed = reminderList.filter(r => r.isCompleted);
    const touchdowns = completed.filter(r => r.completionStatus === 'touchdown').length;
    const fieldGoals = completed.filter(r => r.completionStatus === 'field-goal').length;
    const turnovers = completed.filter(r => r.completionStatus === 'turnover').length;

    // Calculate current streak (consecutive touchdowns from most recent)
    const sortedCompleted = [...completed]
      .filter(r => r.completedAt)
      .sort((a, b) => parseISO(b.completedAt!).getTime() - parseISO(a.completedAt!).getTime());

    let currentStreak = 0;
    for (const r of sortedCompleted) {
      if (r.completionStatus === 'touchdown') {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    let bestStreak = 0;
    let tempStreak = 0;
    const chronological = [...sortedCompleted].reverse();
    for (const r of chronological) {
      if (r.completionStatus === 'touchdown') {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return {
      touchdowns,
      fieldGoals,
      turnovers,
      currentStreak,
      bestStreak,
      totalPlays: reminderList.length,
    };
  };

  // Sync local reminders to Firestore
  const syncLocalToCloud = async (userId: string, localReminders: Reminder[], localStats: Stats) => {
    if (!db) return;

    try {
      const batch = writeBatch(db);

      // Add all local reminders to Firestore
      for (const reminder of localReminders) {
        const reminderRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.REMINDERS, reminder.id);
        batch.set(reminderRef, reminder);
      }

      // Save stats
      const statsRef = doc(db, COLLECTIONS.USERS, userId);
      batch.set(statsRef, { stats: localStats }, { merge: true });

      await batch.commit();

      // Clear local storage after successful sync
      setStoredReminders([]);
      setStoredStats(DEFAULT_STATS);
    } catch (error) {
      console.error('Failed to sync local data to cloud:', error);
    }
  };

  // Save reminder to Firestore
  const saveReminderToFirestore = async (reminder: Reminder) => {
    if (!user || !db) return;

    try {
      const reminderRef = doc(db, COLLECTIONS.USERS, user.uid, COLLECTIONS.REMINDERS, reminder.id);
      await setDoc(reminderRef, reminder);
    } catch (error) {
      console.error('Failed to save reminder to Firestore:', error);
    }
  };

  // Delete reminder from Firestore
  const deleteReminderFromFirestore = async (id: string) => {
    if (!user || !db) return;

    try {
      const reminderRef = doc(db, COLLECTIONS.USERS, user.uid, COLLECTIONS.REMINDERS, id);
      await deleteDoc(reminderRef);
    } catch (error) {
      console.error('Failed to delete reminder from Firestore:', error);
    }
  };

  // Check for overdue reminders periodically
  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      let hasChanges = false;

      setReminders(prev => {
        const updated = prev.map(reminder => {
          if (!reminder.isCompleted && isBefore(parseISO(reminder.deadline), now)) {
            hasChanges = true;
            const updatedReminder = {
              ...reminder,
              isCompleted: true,
              completedAt: now.toISOString(),
              completionStatus: 'turnover' as CompletionStatus
            };

            // Sync to Firestore if logged in
            if (user && db) {
              saveReminderToFirestore(updatedReminder);
            }

            return updatedReminder;
          }
          return reminder;
        });

        return hasChanges ? updated : prev;
      });
    };

    checkOverdue();
    const interval = setInterval(checkOverdue, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const addReminder = useCallback((reminderData: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      isCompleted: false
    };

    if (user && db) {
      // Save to Firestore (will update local state via subscription)
      saveReminderToFirestore(newReminder);
    } else {
      // Local only
      setReminders(prev => [...prev, newReminder]);
      setStats(s => ({ ...s, totalPlays: s.totalPlays + 1 }));
    }
  }, [user]);

  const updateReminder = useCallback((id: string, updates: Partial<Reminder>) => {
    if (user && db) {
      // Find the reminder and update in Firestore
      const reminder = reminders.find(r => r.id === id);
      if (reminder) {
        saveReminderToFirestore({ ...reminder, ...updates });
      }
    } else {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    }
  }, [user, reminders]);

  const deleteReminder = useCallback((id: string) => {
    if (user && db) {
      deleteReminderFromFirestore(id);
    } else {
      setReminders(prev => prev.filter(r => r.id !== id));
    }
  }, [user]);

  const completeReminder = useCallback((id: string) => {
    const now = new Date();
    const reminder = reminders.find(r => r.id === id);

    if (!reminder || reminder.isCompleted) return;

    const deadline = parseISO(reminder.deadline);
    const isOnTime = isBefore(now, deadline);
    const status: CompletionStatus = isOnTime ? 'touchdown' : 'field-goal';

    const updatedReminder: Reminder = {
      ...reminder,
      isCompleted: true,
      completedAt: now.toISOString(),
      completionStatus: status
    };

    if (user && db) {
      // Save to Firestore (will update local state via subscription)
      saveReminderToFirestore(updatedReminder);
    } else {
      // Local only
      setReminders(prev => prev.map(r => r.id === id ? updatedReminder : r));

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
    }
  }, [reminders, user]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your plays...</p>
        </div>
      </div>
    );
  }

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
