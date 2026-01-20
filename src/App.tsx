import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isBefore, parseISO } from 'date-fns';
import { ReminderProvider, useReminders } from './contexts/ReminderContext';
import { Layout } from './components/layout';
import { Dashboard } from './components/dashboard';
import { ReminderList, ReminderForm } from './components/reminders';
import { CompletedList } from './components/completed';
import { Calendar } from './components/calendar';
import { BraceletScanner } from './components/scan';
import { Modal, Celebration, IntroTour, useIntroTour } from './components/common';
import { useNotifications } from './hooks/useNotifications';
import type { Reminder, CompletionStatus } from './lib/types';

type NavItem = 'dashboard' | 'playbook' | 'calendar' | 'scan' | 'touchdowns' | 'add';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [celebration, setCelebration] = useState<{ type: 'touchdown' | 'field-goal'; visible: boolean }>({
    type: 'touchdown',
    visible: false
  });
  const { addReminder, updateReminder, completeReminder, reminders, getUpcomingReminders } = useReminders();
  const { isSupported, permission, requestPermission, sendNotification } = useNotifications();
  const { showTour, completeTour, openTour } = useIntroTour();

  // Request notification permission on first visit
  useEffect(() => {
    if (isSupported && permission === 'default') {
      const timer = setTimeout(() => {
        requestPermission();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission, requestPermission]);

  // Check for upcoming deadlines and send notifications
  useEffect(() => {
    if (permission !== 'granted') return;

    const checkNotifications = () => {
      const upcoming = getUpcomingReminders();
      const now = new Date();

      upcoming.forEach(reminder => {
        if (!reminder.notifyBefore) return;

        const deadline = new Date(reminder.deadline);
        const notifyTime = new Date(deadline.getTime() - reminder.notifyBefore * 60 * 1000);

        const timeDiff = notifyTime.getTime() - now.getTime();
        if (timeDiff > 0 && timeDiff < 60000) {
          sendNotification(`Game Day Alert: ${reminder.title}`, {
            body: `Due in ${reminder.notifyBefore} minutes!`,
            tag: reminder.id,
            requireInteraction: true
          });
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [permission, getUpcomingReminders, sendNotification]);

  const handleCompleteReminder = useCallback((id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    const now = new Date();
    const deadline = parseISO(reminder.deadline);
    const isOnTime = isBefore(now, deadline);
    const celebrationType: CompletionStatus = isOnTime ? 'touchdown' : 'field-goal';

    completeReminder(id);

    // Show celebration
    setCelebration({ type: celebrationType, visible: true });
  }, [reminders, completeReminder]);

  const handleTabChange = (tab: NavItem) => {
    if (tab === 'add') {
      setEditingReminder(null);
      setIsModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleAddReminder = () => {
    setEditingReminder(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    if (editingReminder) {
      updateReminder(editingReminder.id, data);
    } else {
      addReminder(data);
    }
    setIsModalOpen(false);
    setEditingReminder(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingReminder(null);
  };

  const handleScanComplete = (data: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => {
    addReminder(data);
    setActiveTab('dashboard');
  };

  const handleScanCancel = () => {
    setActiveTab('dashboard');
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange} onOpenTour={openTour}>
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Dashboard
              onEditReminder={handleEditReminder}
              onAddReminder={handleAddReminder}
              onCompleteReminder={handleCompleteReminder}
            />
          </motion.div>
        )}

        {activeTab === 'playbook' && (
          <motion.div
            key="playbook"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ReminderList
              onEditReminder={handleEditReminder}
              onAddReminder={handleAddReminder}
              onCompleteReminder={handleCompleteReminder}
            />
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Calendar
              onEditReminder={handleEditReminder}
              onAddReminder={handleAddReminder}
              onCompleteReminder={handleCompleteReminder}
            />
          </motion.div>
        )}

        {activeTab === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <BraceletScanner
              onCreateReminder={handleScanComplete}
              onCancel={handleScanCancel}
            />
          </motion.div>
        )}

        {activeTab === 'touchdowns' && (
          <motion.div
            key="touchdowns"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <CompletedList />
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingReminder ? 'Edit Play' : 'New Play'}
        size="lg"
      >
        <ReminderForm
          reminder={editingReminder}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
        />
      </Modal>

      <Celebration
        type={celebration.type}
        isVisible={celebration.visible}
        onComplete={() => setCelebration(c => ({ ...c, visible: false }))}
      />

      <IntroTour
        isVisible={showTour}
        onComplete={completeTour}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <ReminderProvider>
      <AppContent />
    </ReminderProvider>
  );
}
