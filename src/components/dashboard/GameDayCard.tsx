import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useCountdown, type UrgencyLevel } from '../../hooks/useCountdown';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, type Reminder } from '../../lib/types';

interface GameDayCardProps {
  reminder: Reminder;
  onComplete: () => void;
  onEdit: () => void;
  index: number;
}

const urgencyGradients: Record<UrgencyLevel, { bg: string; border: string; glow: string }> = {
  critical: {
    bg: 'from-red-500/20 to-orange-500/10',
    border: 'border-red-500/50',
    glow: 'rgba(239, 68, 68, 0.3)'
  },
  overdue: {
    bg: 'from-red-900/30 to-gray-900/50',
    border: 'border-red-500/30',
    glow: 'rgba(239, 68, 68, 0.2)'
  },
  urgent: {
    bg: 'from-orange-500/15 to-amber-500/10',
    border: 'border-orange-500/40',
    glow: 'rgba(249, 115, 22, 0.25)'
  },
  soon: {
    bg: 'from-yellow-500/10 to-amber-500/5',
    border: 'border-yellow-500/30',
    glow: 'rgba(234, 179, 8, 0.2)'
  },
  upcoming: {
    bg: 'from-green-700/15 to-green-500/10',
    border: 'border-green-500/30',
    glow: 'rgba(32, 55, 49, 0.3)'
  },
  normal: {
    bg: 'from-gray-800/50 to-gray-900/50',
    border: 'border-white/10',
    glow: 'transparent'
  }
};

function CountdownDisplay({ countdown }: { countdown: ReturnType<typeof useCountdown> }) {
  const urgencyStyles = urgencyGradients[countdown.urgencyLevel];

  return (
    <motion.div
      className="relative"
      animate={countdown.urgencyLevel === 'critical' ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <div
        className={`
          bg-gradient-to-br ${urgencyStyles.bg} backdrop-blur-sm
          border ${urgencyStyles.border} rounded-xl px-4 py-2 text-right
        `}
        style={{ boxShadow: `0 0 20px ${urgencyStyles.glow}` }}
      >
        {countdown.isOverdue ? (
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⚠️
            </motion.span>
            <span className="text-red-400 font-bold">OVERDUE</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-end gap-1">
              {countdown.days > 0 && (
                <>
                  <span className="text-2xl font-black text-white">{countdown.days}</span>
                  <span className="text-xs text-gray-400 mr-1">d</span>
                </>
              )}
              {(countdown.days > 0 || countdown.hours > 0) && (
                <>
                  <span className="text-2xl font-black text-white">{countdown.hours}</span>
                  <span className="text-xs text-gray-400 mr-1">h</span>
                </>
              )}
              <span className="text-2xl font-black text-white">{countdown.minutes}</span>
              <span className="text-xs text-gray-400 mr-1">m</span>
              {countdown.days === 0 && countdown.hours === 0 && (
                <>
                  <motion.span
                    className="text-2xl font-black text-white"
                    key={countdown.seconds}
                    initial={{ opacity: 0.5, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {countdown.seconds}
                  </motion.span>
                  <span className="text-xs text-gray-400">s</span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">remaining</div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export function GameDayCard({ reminder, onComplete, onEdit, index }: GameDayCardProps) {
  const countdown = useCountdown(reminder.deadline);
  const priorityConfig = PRIORITY_CONFIG[reminder.priority];
  const categoryConfig = CATEGORY_CONFIG[reminder.category];
  const urgencyStyles = urgencyGradients[countdown.urgencyLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: urgencyStyles.glow }}
      />

      <div
        className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br ${urgencyStyles.bg}
          backdrop-blur-xl border ${urgencyStyles.border}
          transition-all duration-300
          ${countdown.urgencyLevel === 'critical' ? 'urgency-critical' : ''}
        `}
      >
        {/* Animated top border for critical items */}
        {countdown.urgencyLevel === 'critical' && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
        )}

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

        <div className="relative p-5">
          {/* Header with badges and countdown */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-wrap gap-2">
              {/* Priority badge */}
              <motion.span
                whileHover={{ scale: 1.1 }}
                className={`
                  inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold
                  ${priorityConfig.bgColor} ${priorityConfig.color}
                  border border-current/20
                `}
              >
                {reminder.priority === 'hail-mary' && '🚨 '}
                {reminder.priority === 'red-zone' && '🎯 '}
                {priorityConfig.label}
              </motion.span>

              {/* Category badge */}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                <span>{categoryConfig.icon}</span>
                <span>{categoryConfig.label}</span>
              </span>
            </div>

            {/* Countdown display */}
            <CountdownDisplay countdown={countdown} />
          </div>

          {/* Title */}
          <motion.h3
            className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all"
          >
            {reminder.title}
          </motion.h3>

          {/* Description */}
          {reminder.description && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{reminder.description}</p>
          )}

          {/* Deadline info */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
            <motion.span
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📅
            </motion.span>
            <span>{format(parseISO(reminder.deadline), 'EEEE, MMM d · h:mm a')}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {/* Complete button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onComplete}
              className={`
                flex-1 relative overflow-hidden
                py-3 px-4 rounded-xl font-bold text-white
                bg-gradient-to-r from-green-500 to-emerald-500
                shadow-lg shadow-green-500/25
                transition-all duration-300
                hover:shadow-green-500/40 hover:shadow-xl
              `}
            >
              {/* Shine animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-500" />

              <span className="relative flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  🏈
                </motion.span>
                <span>{countdown.isOverdue ? 'Mark Complete' : 'Touchdown!'}</span>
              </span>
            </motion.button>

            {/* Edit button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              aria-label="Edit reminder"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
