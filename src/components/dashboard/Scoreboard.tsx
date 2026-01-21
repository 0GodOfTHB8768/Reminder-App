import { motion } from 'framer-motion';
import { useReminders } from '../../contexts/ReminderContext';

interface StatItemProps {
  label: string;
  value: number;
  icon: string;
  gradient: string;
  glowColor: string;
  delay: number;
}

function StatItem({ label, value, icon, gradient, glowColor, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 md:group-hover:opacity-40 transition-opacity duration-300"
        style={{ background: glowColor }}
      />

      <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-3 sm:p-4 overflow-hidden min-h-[100px] flex items-center justify-center">
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />

        <div className="relative flex flex-col items-center w-full">
          {/* Icon with bounce animation */}
          <motion.div
            className="text-2xl sm:text-3xl mb-1 sm:mb-2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: delay * 2 }}
          >
            {icon}
          </motion.div>

          {/* Value with gradient */}
          <motion.div
            key={value}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {value}
          </motion.div>

          {/* Label */}
          <div className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider text-center">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Scoreboard() {
  const { stats } = useReminders();

  const winRate = (stats.touchdowns + stats.fieldGoals + stats.turnovers) > 0
    ? Math.round((stats.touchdowns / (stats.touchdowns + stats.fieldGoals + stats.turnovers)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl sm:text-2xl"
          >
            🏟️
          </motion.span>
          <span className="gradient-text">Season Stats</span>
        </h2>

        {/* Win rate badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5"
        >
          <span className="text-xs sm:text-sm font-bold text-green-400">{winRate}%</span>
          <span className="text-[10px] sm:text-xs text-gray-400 hidden xs:inline">Win Rate</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        <StatItem
          label="Touchdowns"
          value={stats.touchdowns}
          icon="🏈"
          gradient="from-green-400 to-emerald-400"
          glowColor="rgba(34, 197, 94, 0.5)"
          delay={0}
        />
        <StatItem
          label="Field Goals"
          value={stats.fieldGoals}
          icon="🥅"
          gradient="from-amber-400 to-yellow-400"
          glowColor="rgba(245, 158, 11, 0.5)"
          delay={0.1}
        />
        <StatItem
          label="Turnovers"
          value={stats.turnovers}
          icon="💨"
          gradient="from-red-400 to-orange-400"
          glowColor="rgba(239, 68, 68, 0.5)"
          delay={0.2}
        />
        <StatItem
          label="Streak"
          value={stats.currentStreak}
          icon="🔥"
          gradient="from-orange-400 to-red-400"
          glowColor="rgba(249, 115, 22, 0.5)"
          delay={0.3}
        />
      </div>

      {/* Best Streak Banner */}
      {stats.bestStreak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-3 sm:mt-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/20 to-yellow-500/10 rounded-xl" />
          <div className="relative flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 border border-yellow-500/20 rounded-xl">
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl sm:text-2xl"
            >
              🏆
            </motion.span>
            <div className="text-center">
              <span className="text-gray-400 text-xs sm:text-sm">All-Time Best Streak</span>
              <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                {stats.bestStreak} {stats.bestStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="text-xl sm:text-2xl"
            >
              🏆
            </motion.span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
