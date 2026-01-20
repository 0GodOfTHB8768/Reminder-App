import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReminders } from '../../contexts/ReminderContext';
import { ReminderItem } from './ReminderItem';
import { Button } from '../common';
import type { Reminder, Priority, Category } from '../../lib/types';
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../../lib/types';

interface ReminderListProps {
  onEditReminder: (reminder: Reminder) => void;
  onAddReminder: () => void;
  onCompleteReminder: (id: string) => void;
}

type FilterType = 'all' | Priority | Category;

export function ReminderList({ onEditReminder, onAddReminder, onCompleteReminder }: ReminderListProps) {
  const { getUpcomingReminders, deleteReminder } = useReminders();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const upcomingReminders = getUpcomingReminders();

  const filteredReminders = useMemo(() => {
    return upcomingReminders.filter(reminder => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!reminder.title.toLowerCase().includes(query) &&
            !reminder.description?.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category/Priority filter
      if (filter === 'all') return true;
      if (filter in PRIORITY_CONFIG) return reminder.priority === filter;
      if (filter in CATEGORY_CONFIG) return reminder.category === filter;
      return true;
    });
  }, [upcomingReminders, filter, searchQuery]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this play?')) {
      deleteReminder(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>📖</span> Playbook
        </h2>
        <Button variant="primary" size="sm" onClick={onAddReminder}>
          + New Play
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search plays..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All ({upcomingReminders.length})
        </FilterButton>

        {/* Priority filters */}
        {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((priority) => {
          const count = upcomingReminders.filter(r => r.priority === priority).length;
          if (count === 0) return null;
          return (
            <FilterButton
              key={priority}
              active={filter === priority}
              onClick={() => setFilter(priority)}
            >
              {PRIORITY_CONFIG[priority].label} ({count})
            </FilterButton>
          );
        })}

        {/* Category filters */}
        {(Object.keys(CATEGORY_CONFIG) as Category[]).map((category) => {
          const count = upcomingReminders.filter(r => r.category === category).length;
          if (count === 0) return null;
          return (
            <FilterButton
              key={category}
              active={filter === category}
              onClick={() => setFilter(category)}
            >
              {CATEGORY_CONFIG[category].icon} {CATEGORY_CONFIG[category].label} ({count})
            </FilterButton>
          );
        })}
      </div>

      {/* List */}
      {filteredReminders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-400"
        >
          {searchQuery || filter !== 'all' ? (
            <>
              <p className="mb-2">No plays match your filters</p>
              <Button variant="ghost" size="sm" onClick={() => { setFilter('all'); setSearchQuery(''); }}>
                Clear filters
              </Button>
            </>
          ) : (
            <>
              <div className="text-4xl mb-4">📭</div>
              <p className="mb-4">Your playbook is empty</p>
              <Button variant="primary" onClick={onAddReminder}>
                Add Your First Play
              </Button>
            </>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onComplete={() => onCompleteReminder(reminder.id)}
                onEdit={() => onEditReminder(reminder)}
                onDelete={() => handleDelete(reminder.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
        ${active
          ? 'bg-primary-600 text-white'
          : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
        }
      `}
    >
      {children}
    </button>
  );
}
