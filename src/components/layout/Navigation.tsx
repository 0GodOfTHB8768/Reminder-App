import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { useReminders } from '../../contexts/ReminderContext';
import { useTheme } from '../../contexts/ThemeContext';

type NavItem = 'dashboard' | 'playbook' | 'calendar' | 'scan' | 'touchdowns' | 'add';

interface NavigationProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
  onOpenTour?: () => void;
}

interface NavItemConfig {
  id: NavItem;
  label: string;
  icon: ReactNode;
  usePrimary?: boolean;
}

// Left side items (before Add button)
const leftNavItems: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Home',
    usePrimary: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: 'playbook',
    label: 'Playbook',
    usePrimary: false,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  }
];

// Right side items (after Add button)
const rightNavItems: NavItemConfig[] = [
  {
    id: 'touchdowns',
    label: 'Scores',
    usePrimary: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
  {
    id: 'calendar',
    label: 'Calendar',
    usePrimary: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'scan',
    label: 'Scan',
    usePrimary: false,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

// All nav items in order for desktop
const allNavItems: NavItemConfig[] = [
  ...leftNavItems,
  {
    id: 'add',
    label: 'New Play',
    usePrimary: false,
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )
  },
  ...rightNavItems
];

function NavTooltip({ label, glowColor }: { label: string; glowColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50"
    >
      <div
        className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-2xl whitespace-nowrap"
        style={{ boxShadow: `0 0 20px ${glowColor}` }}
      >
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-l border-b border-white/10" />
        <span className="text-white text-sm font-medium">{label}</span>
      </div>
    </motion.div>
  );
}

export function Navigation({ activeTab, onTabChange, onOpenTour }: NavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<NavItem | null>(null);
  const { stats, getUpcomingReminders } = useReminders();
  const { theme } = useTheme();
  const upcomingCount = getUpcomingReminders().length;

  const getItemColors = (item: NavItemConfig) => {
    const colorRgb = item.usePrimary ? theme.primaryRgb : theme.secondaryRgb;
    return {
      gradient: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
      glowColor: `rgba(${colorRgb}, 0.5)`,
    };
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/98 to-gray-900/95 backdrop-blur-xl border-t border-white/10 safe-bottom z-30">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left items */}
          <div className="flex items-center gap-1">
            {leftNavItems.map((item) => {
              const colors = getItemColors(item);
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400'}`}
                  aria-label={item.label}
                >
                  <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.3 }} className="w-6 h-6">
                    {item.icon}
                  </motion.div>
                  <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                      style={{ background: colors.gradient, boxShadow: `0 0 8px ${colors.glowColor}` }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Centered Add button */}
          <motion.button
            onClick={() => onTabChange('add')}
            whileTap={{ scale: 0.9 }}
            className="relative -mt-6"
            aria-label="New Play"
          >
            <motion.div
              className="p-4 rounded-full shadow-lg text-white"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 20px rgba(${theme.secondaryRgb}, 0.5)`
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </motion.div>
          </motion.button>

          {/* Right items */}
          <div className="flex items-center gap-1">
            {rightNavItems.map((item) => {
              const colors = getItemColors(item);
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400'}`}
                  aria-label={item.label}
                >
                  <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.3 }} className="w-6 h-6">
                    {item.icon}
                  </motion.div>
                  <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                      style={{ background: colors.gradient, boxShadow: `0 0 8px ${colors.glowColor}` }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 bg-gradient-to-b from-gray-900/80 to-gray-950/90 backdrop-blur-xl border-r border-white/5 z-30">
        {/* Logo */}
        <motion.div
          className="mb-6"
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
          >
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

        {/* All Nav Items together at top */}
        <nav className="flex flex-col items-center gap-3">
          {allNavItems.map((item, index) => {
            const colors = getItemColors(item);
            const isActive = activeTab === item.id;
            const isAddButton = item.id === 'add';

            return (
              <div key={item.id} className="relative">
                <motion.button
                  onClick={() => onTabChange(item.id)}
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: isAddButton ? 90 : 0 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300
                    ${isAddButton ? 'text-white shadow-lg' : isActive ? 'text-white' : 'text-gray-500 hover:text-white'}
                  `}
                  style={
                    isAddButton
                      ? { background: colors.gradient, boxShadow: `0 0 20px ${colors.glowColor}` }
                      : isActive
                        ? { boxShadow: `0 0 20px ${colors.glowColor}` }
                        : {}
                  }
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Background glow for active items */}
                  {isActive && !isAddButton && (
                    <motion.div
                      layoutId="desktopActiveBg"
                      className="absolute inset-0 rounded-2xl opacity-20"
                      style={{ background: colors.gradient }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    animate={isActive && !isAddButton ? { rotate: [0, -5, 5, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                  >
                    {item.icon}
                  </motion.div>

                  {/* Active indicator bar */}
                  {isActive && !isAddButton && (
                    <motion.div
                      layoutId="desktopActiveBar"
                      className="absolute -left-[10px] top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full"
                      style={{ background: colors.gradient, boxShadow: `0 0 10px ${colors.glowColor}` }}
                    />
                  )}

                  {/* Notification badge for playbook */}
                  {item.id === 'playbook' && upcomingCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`, boxShadow: `0 0 10px rgba(${theme.secondaryRgb}, 0.5)` }}
                    >
                      {upcomingCount > 9 ? '9+' : upcomingCount}
                    </motion.div>
                  )}
                </motion.button>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <NavTooltip label={item.label} glowColor={colors.glowColor} />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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

          {/* Design Blog link */}
          <motion.a
            href="https://siddharthg125.wixsite.com/designblog"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            aria-label="Design Blog"
            title="Design Blog"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </motion.a>
        </div>
      </aside>
    </>
  );
}
