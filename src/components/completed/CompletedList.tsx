import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReminders } from '../../contexts/ReminderContext';
import { TouchdownCard } from './TouchdownCard';
import { Card } from '../common';
import type { CompletionStatus } from '../../lib/types';

type FilterType = 'all' | CompletionStatus;

export function CompletedList() {
  const { getCompletedReminders, stats } = useReminders();
  const [filter, setFilter] = useState<FilterType>('all');

  const completedReminders = getCompletedReminders();

  const filteredReminders = useMemo(() => {
    if (filter === 'all') return completedReminders;
    return completedReminders.filter(r => r.completionStatus === filter);
  }, [completedReminders, filter]);

  const filterCounts = useMemo(() => ({
    all: completedReminders.length,
    touchdown: completedReminders.filter(r => r.completionStatus === 'touchdown').length,
    'field-goal': completedReminders.filter(r => r.completionStatus === 'field-goal').length,
    turnover: completedReminders.filter(r => r.completionStatus === 'turnover').length
  }), [completedReminders]);

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <Card variant="elevated">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🏆</span> Season Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox
            label="Win Rate"
            value={stats.totalPlays > 0
              ? `${Math.round((stats.touchdowns / stats.totalPlays) * 100)}%`
              : '-'
            }
            subtext={`${stats.touchdowns} of ${stats.totalPlays} plays`}
          />
          <StatBox
            label="Best Streak"
            value={stats.bestStreak.toString()}
            subtext="consecutive TDs"
            icon="🔥"
          />
          <StatBox
            label="Touchdowns"
            value={stats.touchdowns.toString()}
            subtext="completed on time"
            icon="🏈"
            color="text-field-400"
          />
          <StatBox
            label="Field Goals"
            value={stats.fieldGoals.toString()}
            subtext="completed late"
            icon="🥅"
            color="text-leather-400"
          />
        </div>
      </Card>

      {/* History */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>📜</span> History
          </h2>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All ({filterCounts.all})
          </FilterButton>
          <FilterButton
            active={filter === 'touchdown'}
            onClick={() => setFilter('touchdown')}
            className="text-field-400"
          >
            🏈 Touchdowns ({filterCounts.touchdown})
          </FilterButton>
          <FilterButton
            active={filter === 'field-goal'}
            onClick={() => setFilter('field-goal')}
            className="text-leather-400"
          >
            🥅 Field Goals ({filterCounts['field-goal']})
          </FilterButton>
          <FilterButton
            active={filter === 'turnover'}
            onClick={() => setFilter('turnover')}
            className="text-danger-500"
          >
            💨 Turnovers ({filterCounts.turnover})
          </FilterButton>
        </div>

        {/* List */}
        {filteredReminders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            <div className="text-4xl mb-4">🏟️</div>
            <p>No completed plays yet</p>
            <p className="text-sm mt-2">Complete your first deadline to see it here!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredReminders.map((reminder, index) => (
                <TouchdownCard
                  key={reminder.id}
                  reminder={reminder}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}

function StatBox({
  label,
  value,
  subtext,
  icon,
  color = 'text-white'
}: {
  label: string;
  value: string;
  subtext: string;
  icon?: string;
  color?: string;
}) {
  return (
    <div className="text-center">
      {icon && <div className="text-xl mb-1">{icon}</div>}
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-xs text-gray-500">{subtext}</div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  className = '',
  children
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
        ${active
          ? 'bg-primary-600 text-white'
          : `bg-dark-card text-gray-400 hover:text-white border border-dark-border ${className}`
        }
      `}
    >
      {children}
    </button>
  );
}
