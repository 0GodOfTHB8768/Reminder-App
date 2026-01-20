import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { useReminders } from '../../contexts/ReminderContext';
import { CalendarDay } from './CalendarDay';
import { DayDetail } from './DayDetail';
import type { Reminder } from '../../lib/types';

interface CalendarProps {
  onEditReminder: (reminder: Reminder) => void;
  onAddReminder: () => void;
  onCompleteReminder: (id: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar({ onEditReminder, onAddReminder, onCompleteReminder }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { reminders } = useReminders();

  // Get all days to display in the calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Group reminders by date
  const remindersByDate = useMemo(() => {
    return reminders.reduce((acc, reminder) => {
      if (reminder.isCompleted) return acc;
      const dateKey = format(parseISO(reminder.deadline), 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(reminder);
      return acc;
    }, {} as Record<string, Reminder[]>);
  }, [reminders]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseDetail = () => {
    setSelectedDate(null);
  };

  const getRemindersForDate = (date: Date): Reminder[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return remindersByDate[dateKey] || [];
  };

  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Game Calendar
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1">
            View your plays on the schedule
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddReminder}
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-400 rounded-xl text-gray-900 font-semibold shadow-lg hover:shadow-yellow-500/25 transition-shadow"
        >
          + New Play
        </motion.button>
      </motion.div>

      {/* Calendar Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden"
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 bg-gray-900/30">
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            aria-label="Previous month"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.h2
            key={format(currentMonth, 'yyyy-MM')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent"
          >
            {format(currentMonth, 'MMMM yyyy')}
          </motion.h2>

          <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            aria-label="Next month"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-white/10">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dayReminders = getRemindersForDate(date);
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isToday = isSameDay(date, today);
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

            return (
              <CalendarDay
                key={date.toISOString()}
                date={date}
                reminders={dayReminders}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                isSelected={isSelected}
                onClick={() => handleDayClick(date)}
                index={index}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-4 justify-center text-sm text-gray-400"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Hail Mary</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>Red Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>First Down</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span>Practice</span>
        </div>
      </motion.div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDate && (
          <DayDetail
            date={selectedDate}
            reminders={getRemindersForDate(selectedDate)}
            onClose={handleCloseDetail}
            onEditReminder={onEditReminder}
            onCompleteReminder={onCompleteReminder}
            onAddReminder={onAddReminder}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
