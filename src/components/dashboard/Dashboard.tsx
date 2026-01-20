import { AnimatePresence, motion } from 'framer-motion';
import { useReminders } from '../../contexts/ReminderContext';
import { Scoreboard } from './Scoreboard';
import { GameDayCard } from './GameDayCard';
import type { Reminder } from '../../lib/types';

interface DashboardProps {
  onEditReminder: (reminder: Reminder) => void;
  onAddReminder: () => void;
  onCompleteReminder: (id: string) => void;
}

export function Dashboard({ onEditReminder, onAddReminder, onCompleteReminder }: DashboardProps) {
  const { getUpcomingReminders } = useReminders();
  const upcomingReminders = getUpcomingReminders();

  return (
    <div className="space-y-6">
      <Scoreboard />

      <section>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl"
            >
              📋
            </motion.span>
            <span className="gradient-text">Upcoming Plays</span>
          </h2>
          {upcomingReminders.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-gradient-to-r from-green-700/30 to-green-500/20 border border-green-500/30 rounded-full text-sm font-medium text-green-400"
            >
              {upcomingReminders.length} {upcomingReminders.length === 1 ? 'play' : 'plays'}
            </motion.span>
          )}
        </motion.div>

        {upcomingReminders.length === 0 ? (
          <EmptyState onAddReminder={onAddReminder} />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {upcomingReminders.map((reminder, index) => (
                <GameDayCard
                  key={reminder.id}
                  reminder={reminder}
                  index={index}
                  onComplete={() => onCompleteReminder(reminder.id)}
                  onEdit={() => onEditReminder(reminder)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ onAddReminder }: { onAddReminder: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700/15 via-green-500/10 to-yellow-500/10 rounded-3xl" />

      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
        {/* Animated football */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl mb-6 filter drop-shadow-lg"
        >
          🏈
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold gradient-text mb-3"
        >
          Ready for Game Day?
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-8 text-lg"
        >
          Your playbook is empty. Add your first play to start winning!
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddReminder}
          className="relative inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-shadow overflow-hidden group"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

          <motion.span
            animate={{ rotate: [0, 90, 0] }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </motion.span>
          <span className="relative">Add Your First Play</span>
        </motion.button>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-4xl opacity-20">⭐</div>
        <div className="absolute top-8 right-8 text-3xl opacity-20">🏆</div>
        <div className="absolute bottom-4 left-8 text-3xl opacity-20">🔥</div>
        <div className="absolute bottom-8 right-4 text-4xl opacity-20">💪</div>
      </div>
    </motion.div>
  );
}
