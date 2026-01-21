import { useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Badge } from '../common';
import { useCountdown, getUrgencyColor } from '../../hooks/useCountdown';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, type Reminder } from '../../lib/types';

interface ReminderItemProps {
  reminder: Reminder;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ReminderItem({ reminder, onComplete, onEdit, onDelete }: ReminderItemProps) {
  const countdown = useCountdown(reminder.deadline);
  const priorityConfig = PRIORITY_CONFIG[reminder.priority];
  const categoryConfig = CATEGORY_CONFIG[reminder.category];

  // Swipe gesture state
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const SWIPE_THRESHOLD = 80;

  // Transform for background colors
  const backgroundLeft = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0],
    ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0)']
  );
  const backgroundRight = useTransform(
    x,
    [0, SWIPE_THRESHOLD],
    ['rgba(34, 197, 94, 0)', 'rgba(34, 197, 94, 0.3)']
  );

  const leftIconOpacity = useTransform(x, [-SWIPE_THRESHOLD, -20], [1, 0]);
  const rightIconOpacity = useTransform(x, [20, SWIPE_THRESHOLD], [0, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.x > SWIPE_THRESHOLD) {
      onComplete();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onDelete();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="relative touch-pan-y"
    >
      {/* Swipe backgrounds */}
      <motion.div
        className="absolute inset-0 rounded-xl flex items-center justify-start px-4 pointer-events-none"
        style={{ background: backgroundLeft }}
      >
        <motion.div style={{ opacity: leftIconOpacity }} className="text-red-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-xl flex items-center justify-end px-4 pointer-events-none"
        style={{ background: backgroundRight }}
      >
        <motion.div style={{ opacity: rightIconOpacity }} className="text-green-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Draggable card */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className={`bg-dark-card border border-dark-border rounded-xl p-4 transition-colors group ${!isDragging ? 'hover:border-gray-700' : ''}`}
      >
      <div className="flex items-start gap-3">
        {/* Complete checkbox */}
        <button
          onClick={onComplete}
          className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-600 hover:border-field-400 hover:bg-field-400/20 transition-colors flex items-center justify-center group/check"
          aria-label="Complete reminder"
        >
          <svg
            className="w-4 h-4 text-field-400 opacity-0 group-hover/check:opacity-100 transition-opacity"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-white truncate">{reminder.title}</h3>
            <div className={`text-sm font-mono ${getUrgencyColor(countdown.urgencyLevel)}`}>
              {countdown.displayText}
            </div>
          </div>

          {reminder.description && (
            <p className="text-sm text-gray-400 truncate mb-2">{reminder.description}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="custom" size="sm" className={`${priorityConfig.bgColor} ${priorityConfig.color}`}>
              {priorityConfig.label}
            </Badge>
            <Badge variant="custom" size="sm" className="bg-gray-500/20 text-gray-400">
              {categoryConfig.icon} {categoryConfig.label}
            </Badge>
            <span className="text-xs text-gray-500">
              {format(parseISO(reminder.deadline), 'MMM d, h:mm a')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-white hover:bg-dark-border rounded-lg transition-colors"
            aria-label="Edit reminder"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-500/20 rounded-lg transition-colors"
            aria-label="Delete reminder"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}
