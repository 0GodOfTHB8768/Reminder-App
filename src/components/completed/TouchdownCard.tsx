import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Badge } from '../common';
import type { Reminder } from '../../lib/types';
import { CATEGORY_CONFIG } from '../../lib/types';

interface TouchdownCardProps {
  reminder: Reminder;
  index: number;
}

const statusConfig = {
  touchdown: {
    icon: '🏈',
    label: 'Touchdown',
    color: 'text-field-400',
    bgColor: 'bg-field-500/20',
    borderColor: 'border-field-500/30'
  },
  'field-goal': {
    icon: '🥅',
    label: 'Field Goal',
    color: 'text-leather-400',
    bgColor: 'bg-leather-500/20',
    borderColor: 'border-leather-500/30'
  },
  turnover: {
    icon: '💨',
    label: 'Turnover',
    color: 'text-danger-500',
    bgColor: 'bg-danger-500/20',
    borderColor: 'border-danger-500/30'
  }
};

export function TouchdownCard({ reminder, index }: TouchdownCardProps) {
  const status = reminder.completionStatus || 'touchdown';
  const config = statusConfig[status];
  const categoryConfig = CATEGORY_CONFIG[reminder.category];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`
        bg-dark-card border ${config.borderColor} rounded-xl p-4
        hover:border-gray-600 transition-colors
      `}
    >
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div className={`text-2xl flex-shrink-0 ${config.bgColor} rounded-full w-10 h-10 flex items-center justify-center`}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-white line-through opacity-70">{reminder.title}</h3>
            <Badge variant="custom" size="sm" className={`${config.bgColor} ${config.color}`}>
              {config.label}
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <span>{categoryConfig.icon}</span>
            <span>{categoryConfig.label}</span>
            <span>•</span>
            <span>
              Completed {reminder.completedAt && format(parseISO(reminder.completedAt), 'MMM d, h:mm a')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
