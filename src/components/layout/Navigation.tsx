import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { useReminders } from '../../contexts/ReminderContext';

type NavItem = 'dashboard' | 'playbook' | 'calendar' | 'touchdowns' | 'add';

interface NavigationProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
  onOpenTour?: () => void;
}

interface NavItemConfig {
  id: NavItem;
  label: string;
  icon: ReactNode;
  gradient: string;
  glowColor: string;
}

const navItems: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Home',
    gradient: 'from-green-700 to-green-500',
    glowColor: 'rgba(32, 55, 49, 0.6)',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'playbook',
    label: 'Playbook',
    gradient: 'from-yellow-500 to-amber-400',
    glowColor: 'rgba(255, 182, 18, 0.5)',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
  {
    id: 'calendar',
    label: 'Calendar',
    gradient: 'from-green-600 to-emerald-500',
    glowColor: 'rgba(46, 125, 50, 0.5)',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'add',
    label: 'New Play',
    gradient: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(255, 182, 18, 0.6)',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )
  },
  {
    id: 'touchdowns',
    label: 'Scores',
    gradient: 'from-green-500 to-green-700',
    glowColor: 'rgba(32, 55, 49, 0.5)',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  }
];

function NavTooltip({ item, stats, upcomingCount }: {
  item: NavItemConfig;
  stats: { touchdowns: number; fieldGoals: number; turnovers: number; currentStreak: number; bestStreak: number };
  upcomingCount: number;
}) {
  const getTooltipContent = () => {
    switch (item.id) {
      case 'dashboard':
        return (
          <>
            <div className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-lg">🏠</span> Dashboard
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Plays</span>
                <span className="text-green-400 font-bold">{upcomingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Streak</span>
                <span className="text-yellow-400 font-bold">{stats.currentStreak} 🔥</span>
              </div>
            </div>
          </>
        );
      case 'playbook':
        return (
          <>
            <div className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-lg">📋</span> Playbook
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Pending Plays</span>
                <span className="text-yellow-400 font-bold">{upcomingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Plays</span>
                <span className="text-green-400 font-bold">{stats.touchdowns + stats.fieldGoals + stats.turnovers + upcomingCount}</span>
              </div>
            </div>
          </>
        );
      case 'calendar':
        return (
          <>
            <div className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-lg">📅</span> Calendar
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Scheduled Plays</span>
                <span className="text-green-400 font-bold">{upcomingCount}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                View your plays on the calendar
              </div>
            </div>
          </>
        );
      case 'add':
        return (
          <>
            <div className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-lg">➕</span> New Play
            </div>
            <div className="text-sm text-gray-400">
              Add a new deadline to your playbook
            </div>
            <div className="mt-2 text-xs text-yellow-400 font-medium">
              Click to create!
            </div>
          </>
        );
      case 'touchdowns':
        const winRate = (stats.touchdowns + stats.fieldGoals + stats.turnovers) > 0
          ? Math.round((stats.touchdowns / (stats.touchdowns + stats.fieldGoals + stats.turnovers)) * 100)
          : 0;
        return (
          <>
            <div className="font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-lg">🏆</span> Season Stats
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Touchdowns</span>
                <span className="text-green-400 font-bold">{stats.touchdowns} 🏈</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Field Goals</span>
                <span className="text-yellow-400 font-bold">{stats.fieldGoals} 🥅</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-green-400 font-bold">{winRate}%</span>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50"
    >
      <div
        className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 min-w-[180px] shadow-2xl"
        style={{ boxShadow: `0 0 30px ${item.glowColor}` }}
      >
        {/* Arrow */}
        <div
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-l border-b border-white/10"
        />
        {getTooltipContent()}
      </div>
    </motion.div>
  );
}

export function Navigation({ activeTab, onTabChange, onOpenTour }: NavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<NavItem | null>(null);
  const { stats, getUpcomingReminders } = useReminders();
  const upcomingCount = getUpcomingReminders().length;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/98 to-gray-900/95 backdrop-blur-xl border-t border-white/10 safe-bottom z-30">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              whileTap={{ scale: 0.9 }}
              className={`
                relative flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300
                ${activeTab === item.id ? 'text-white' : 'text-gray-400'}
                ${item.id === 'add' ? 'rounded-full -mt-6' : ''}
              `}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              {item.id === 'add' ? (
                <motion.div
                  className={`p-4 rounded-full bg-gradient-to-br ${item.gradient} shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ boxShadow: `0 0 20px ${item.glowColor}` }}
                >
                  {item.icon}
                </motion.div>
              ) : (
                <>
                  <motion.div
                    animate={activeTab === item.id ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r ${item.gradient}`}
                      style={{ boxShadow: `0 0 10px ${item.glowColor}` }}
                    />
                  )}
                </>
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 bg-gradient-to-b from-gray-900/80 to-gray-950/90 backdrop-blur-xl border-r border-white/5 z-30">
        {/* Logo */}
        <motion.div
          className="mb-8"
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-700 to-green-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
            <motion.span
              className="text-2xl relative z-10"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🏈
            </motion.span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] animate-[shine_3s_infinite]" />
          </div>
        </motion.div>

        {/* Nav Items */}
        <nav className="flex flex-col items-center gap-3 flex-1">
          {navItems.map((item, index) => (
            <div key={item.id} className="relative">
              <motion.button
                onClick={() => onTabChange(item.id)}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300
                  ${item.id === 'add'
                    ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg`
                    : activeTab === item.id
                      ? 'text-white'
                      : 'text-gray-500 hover:text-white'
                  }
                `}
                style={item.id === 'add' || activeTab === item.id ? { boxShadow: `0 0 20px ${item.glowColor}` } : {}}
                aria-label={item.label}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                {/* Background glow for active items */}
                {activeTab === item.id && item.id !== 'add' && (
                  <motion.div
                    layoutId="desktopActiveBg"
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-20`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon with animation */}
                <motion.div
                  animate={activeTab === item.id ? { rotate: [0, -5, 5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  {item.icon}
                </motion.div>

                {/* Active indicator bar */}
                {activeTab === item.id && item.id !== 'add' && (
                  <motion.div
                    layoutId="desktopActiveBar"
                    className={`absolute -left-[10px] top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full bg-gradient-to-b ${item.gradient}`}
                    style={{ boxShadow: `0 0 10px ${item.glowColor}` }}
                  />
                )}

                {/* Notification badge for playbook */}
                {item.id === 'playbook' && upcomingCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                    style={{ boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}
                  >
                    {upcomingCount > 9 ? '9+' : upcomingCount}
                  </motion.div>
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredItem === item.id && (
                  <NavTooltip item={item} stats={stats} upcomingCount={upcomingCount} />
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto flex flex-col items-center gap-3 mb-4">
          {/* Streak indicator */}
          {stats.currentStreak > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-center"
              >
                <span className="text-lg">🔥</span>
                <div className="text-xs font-bold text-orange-400">{stats.currentStreak}</div>
              </motion.div>
            </motion.div>
          )}

          {/* Help/Tour button */}
          {onOpenTour && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenTour}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
              aria-label="View intro tour"
              title="Learn the rules"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.button>
          )}
        </div>
      </aside>
    </>
  );
}
