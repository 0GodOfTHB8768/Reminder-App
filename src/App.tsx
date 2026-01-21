import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { isBefore, parseISO } from 'date-fns';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ReminderProvider, useReminders } from './contexts/ReminderContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout';
import { Dashboard } from './components/dashboard';
import { ReminderForm } from './components/reminders';
import { Modal, useIntroTour } from './components/common';
import { useNotifications } from './hooks/useNotifications';
import type { Reminder, CompletionStatus } from './lib/types';

// Lazy load heavy components
const ReminderList = lazy(() => import('./components/reminders').then(m => ({ default: m.ReminderList })));
const CompletedList = lazy(() => import('./components/completed').then(m => ({ default: m.CompletedList })));
const Calendar = lazy(() => import('./components/calendar').then(m => ({ default: m.Calendar })));
const BraceletScanner = lazy(() => import('./components/scan').then(m => ({ default: m.BraceletScanner })));
const AuthModal = lazy(() => import('./components/auth').then(m => ({ default: m.AuthModal })));
const OnboardingModal = lazy(() => import('./components/auth').then(m => ({ default: m.OnboardingModal })));
const SettingsModal = lazy(() => import('./components/auth').then(m => ({ default: m.SettingsModal })));
const Celebration = lazy(() => import('./components/common').then(m => ({ default: m.Celebration })));
const IntroTour = lazy(() => import('./components/common').then(m => ({ default: m.IntroTour })));

// Loading fallback
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
    </div>
  );
}

type NavItem = 'dashboard' | 'playbook' | 'calendar' | 'scan' | 'touchdowns' | 'add';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [celebration, setCelebration] = useState<{ type: 'touchdown' | 'field-goal'; visible: boolean }>({
    type: 'touchdown',
    visible: false
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { addReminder, updateReminder, deleteReminder, completeReminder, reminders, getUpcomingReminders } = useReminders();
  const { isSupported, permission, requestPermission, sendNotification } = useNotifications();
  const { showTour, completeTour, openTour } = useIntroTour();
  const { needsOnboarding, user } = useAuth();

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
    <Layout activeTab={activeTab} onTabChange={handleTabChange} onOpenTour={openTour} onOpenAuth={() => setIsAuthModalOpen(true)} onOpenSettings={() => setIsSettingsModalOpen(true)}>
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Dashboard
                onEditReminder={handleEditReminder}
                onAddReminder={handleAddReminder}
                onCompleteReminder={handleCompleteReminder}
                onDeleteReminder={deleteReminder}
              />
            </motion.div>
          )}

          {activeTab === 'playbook' && (
            <motion.div
              key="playbook"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <CompletedList />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>

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

      <Suspense fallback={null}>
        {celebration.visible && (
          <Celebration
            type={celebration.type}
            isVisible={celebration.visible}
            onComplete={() => setCelebration(c => ({ ...c, visible: false }))}
          />
        )}

        {showTour && (
          <IntroTour
            isVisible={showTour}
            onComplete={completeTour}
          />
        )}

        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}

        {needsOnboarding && user && (
          <OnboardingModal isOpen={needsOnboarding && !!user} />
        )}

        {isSettingsModalOpen && (
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
          />
        )}
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ReminderProvider>
          <AppContent />
        </ReminderProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
