import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { format, parseISO } from 'date-fns';
import type { Reminder } from '../../lib/types';
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../../lib/types';

interface DayDetailProps {
  date: Date;
  reminders: Reminder[];
  onClose: () => void;
  onEditReminder: (reminder: Reminder) => void;
  onCompleteReminder: (id: string) => void;
  onAddReminder: () => void;
}

export function DayDetail({
  date,
  reminders,
  onClose,
  onEditReminder,
  onCompleteReminder,
  onAddReminder
}: DayDetailProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const sortedReminders = [...reminders].sort((a, b) => {
    const priorityOrder = ['hail-mary', 'red-zone', 'first-down', 'practice'];
    return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
  });

  const handleAddClick = () => {
    onClose();
    onAddReminder();
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="day-detail-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border bg-gradient-to-r from-green-700/20 to-yellow-500/10">
            <div>
              <h2 id="day-detail-title" className="text-lg font-semibold text-white">
                {format(date, 'EEEE')}
              </h2>
              <p className="text-sm text-gray-400">
                {format(date, 'MMMM d, yyyy')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {sortedReminders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">
                  {format(date, 'EEEE') === 'Sunday' ? '🏈' : '📅'}
                </div>
                <p className="text-gray-400 mb-4">No plays scheduled</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddClick}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-400 rounded-xl text-gray-900 font-semibold shadow-lg hover:shadow-yellow-500/25 transition-shadow"
                >
                  + Schedule a Play
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedReminders.map((reminder, index) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      p-4 rounded-xl border border-white/10
                      bg-gradient-to-r from-gray-800/50 to-gray-900/50
                      hover:border-white/20 transition-colors
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Title & Priority */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[reminder.priority].bgColor} ${PRIORITY_CONFIG[reminder.priority].color}`}>
                            {PRIORITY_CONFIG[reminder.priority].label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {CATEGORY_CONFIG[reminder.category].icon}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-white truncate">
                          {reminder.title}
                        </h3>

                        {/* Time */}
                        <p className="text-sm text-gray-400 mt-1">
                          Due at {format(parseISO(reminder.deadline), 'h:mm a')}
                        </p>

                        {/* Description */}
                        {reminder.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {reminder.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            onClose();
                            onCompleteReminder(reminder.id);
                          }}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          aria-label="Complete"
                          title="Score!"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            onClose();
                            onEditReminder(reminder);
                          }}
                          className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                          aria-label="Edit"
                          title="Edit play"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add More Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddClick}
                  className="w-full p-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:border-yellow-500/50 hover:text-yellow-400 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add another play
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>,
    document.body
  );
}
