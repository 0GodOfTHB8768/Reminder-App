import { motion } from 'framer-motion';
import { format } from 'date-fns';
import type { Reminder, Priority } from '../../lib/types';

interface CalendarDayProps {
  date: Date;
  reminders: Reminder[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  'hail-mary': 'bg-red-500',
  'red-zone': 'bg-orange-500',
  'first-down': 'bg-green-500',
  'practice': 'bg-gray-500'
};

const PRIORITY_ORDER: Priority[] = ['hail-mary', 'red-zone', 'first-down', 'practice'];

export function CalendarDay({
  date,
  reminders,
  isCurrentMonth,
  isToday,
  isSelected,
  onClick,
  index
}: CalendarDayProps) {
  const dayNumber = format(date, 'd');

  // Sort reminders by priority to show most important first
  const sortedReminders = [...reminders].sort((a, b) => {
    return PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
  });

  // Get unique priority colors (up to 3)
  const priorityDots = sortedReminders
    .slice(0, 3)
    .map(r => PRIORITY_COLORS[r.priority]);

  const hasMore = reminders.length > 3;
  const highestPriority = sortedReminders[0]?.priority;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.01, duration: 0.2 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative aspect-square p-1 md:p-2 border-r border-b border-white/5
        transition-colors duration-200 group
        ${isCurrentMonth ? 'bg-transparent' : 'bg-gray-900/30'}
        ${isSelected ? 'bg-yellow-500/20' : 'hover:bg-white/5'}
        ${isToday ? 'ring-2 ring-inset ring-yellow-500' : ''}
      `}
      aria-label={`${format(date, 'MMMM d, yyyy')}${reminders.length > 0 ? `, ${reminders.length} plays` : ''}`}
    >
      {/* Date Number */}
      <div
        className={`
          text-sm md:text-base font-medium
          ${isCurrentMonth ? 'text-white' : 'text-gray-600'}
          ${isToday ? 'text-yellow-400 font-bold' : ''}
        `}
      >
        {dayNumber}
      </div>

      {/* Reminder Indicators */}
      {reminders.length > 0 && (
        <div className="absolute bottom-1 md:bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
          {priorityDots.map((color, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${color}`}
              style={{
                boxShadow: isCurrentMonth ? `0 0 4px ${color.replace('bg-', 'rgb(').replace('-500', ', 0.5)')}` : undefined
              }}
            />
          ))}
          {hasMore && (
            <span className="text-[10px] text-gray-400 ml-0.5">
              +{reminders.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Hover Preview (Desktop) */}
      {reminders.length > 0 && (
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <div className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1 whitespace-nowrap text-xs shadow-xl">
            <span className={`font-medium ${
              highestPriority === 'hail-mary' ? 'text-red-400' :
              highestPriority === 'red-zone' ? 'text-orange-400' :
              highestPriority === 'first-down' ? 'text-green-400' :
              'text-gray-400'
            }`}>
              {reminders.length} {reminders.length === 1 ? 'play' : 'plays'}
            </span>
          </div>
        </div>
      )}
    </motion.button>
  );
}
