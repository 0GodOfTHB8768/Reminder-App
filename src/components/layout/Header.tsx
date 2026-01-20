import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { USER_NAME, FOOTBALL_QUOTES } from '../../lib/constants';
import { useReminders } from '../../contexts/ReminderContext';

export function Header() {
  const { getUpcomingReminders, stats } = useReminders();
  const upcomingCount = getUpcomingReminders().length;
  const currentHour = new Date().getHours();
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate quotes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % FOOTBALL_QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const timeEmoji = currentHour < 12 ? '🌅' : currentHour < 17 ? '☀️' : '🌙';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-4 py-6 md:px-6 relative overflow-hidden"
    >
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-700/20 to-green-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-500/20 to-green-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Date with animation */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-sm flex items-center gap-2"
          >
            <span>{timeEmoji}</span>
            {format(new Date(), 'EEEE, MMMM d')}
          </motion.p>

          {/* Main greeting with gradient */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl font-bold mt-2"
          >
            <span className="text-white">{greeting}, </span>
            <span className="gradient-text">{USER_NAME}</span>
            <motion.span
              className="inline-block ml-2"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
            >
              👋
            </motion.span>
          </motion.h1>

          {/* Rotating motivational quote */}
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="mt-2 flex items-center gap-2"
          >
            <span className="text-lg">💬</span>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 text-sm md:text-base italic font-medium">
              "{FOOTBALL_QUOTES[quoteIndex]}"
            </p>
          </motion.div>
        </div>

        {/* Stats card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          className="flex-shrink-0"
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-yellow-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />

            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={upcomingCount > 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl"
                  >
                    🎯
                  </motion.div>
                  <div>
                    <motion.div
                      key={upcomingCount}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-black bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent"
                    >
                      {upcomingCount}
                    </motion.div>
                    <div className="text-xs text-gray-400 font-medium">
                      {upcomingCount === 1 ? 'Play' : 'Plays'} to make
                    </div>
                  </div>
                </div>

                {/* Mini streak indicator */}
                {stats.currentStreak > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-2"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      🔥
                    </motion.span>
                    <span className="text-sm font-bold text-orange-400">
                      {stats.currentStreak} streak!
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
