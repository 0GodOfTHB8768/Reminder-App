import { useState, useEffect } from 'react';
import { format, addHours, parseISO } from 'date-fns';
import { Button } from '../common';
import { PRIORITY_CONFIG, CATEGORY_CONFIG, type Reminder, type Priority, type Category } from '../../lib/types';
import { NOTIFICATION_INTERVALS } from '../../lib/constants';

interface ReminderFormProps {
  reminder?: Reminder | null;
  onSubmit: (data: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onCancel: () => void;
}

export function ReminderForm({ reminder, onSubmit, onCancel }: ReminderFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('first-down');
  const [category, setCategory] = useState<Category>('personal');
  const [notifyBefore, setNotifyBefore] = useState<number | undefined>(30);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with existing reminder data
  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setDescription(reminder.description || '');
      setDeadline(format(parseISO(reminder.deadline), "yyyy-MM-dd'T'HH:mm"));
      setPriority(reminder.priority);
      setCategory(reminder.category);
      setNotifyBefore(reminder.notifyBefore);
    } else {
      // Default to tomorrow at 5pm
      const defaultDeadline = addHours(new Date(), 24);
      defaultDeadline.setMinutes(0);
      setDeadline(format(defaultDeadline, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [reminder]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(deadline) < new Date() && !reminder) {
      newErrors.deadline = 'Deadline must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      deadline: new Date(deadline).toISOString(),
      priority,
      category,
      notifyBefore
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Play Name *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Submit project proposal"
          className={`
            w-full px-4 py-3 bg-dark-bg border rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${errors.title ? 'border-danger-500' : 'border-dark-border'}
          `}
        />
        {errors.title && <p className="mt-1 text-sm text-danger-500">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Notes (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any details about this deadline..."
          rows={3}
          className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Deadline */}
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">
          Game Day (Deadline) *
        </label>
        <input
          type="datetime-local"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={`
            w-full px-4 py-3 bg-dark-bg border rounded-xl text-white
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${errors.deadline ? 'border-danger-500' : 'border-dark-border'}
          `}
        />
        {errors.deadline && <p className="mt-1 text-sm text-danger-500">{errors.deadline}</p>}
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Priority Level
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPriority(key)}
              className={`
                px-4 py-3 rounded-xl border text-left transition-all
                ${priority === key
                  ? `${config.bgColor} ${config.color} border-current`
                  : 'border-dark-border text-gray-400 hover:border-gray-600'
                }
              `}
            >
              <div className="font-medium">{config.label}</div>
              <div className="text-xs opacity-70">{config.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(([key, config]) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              className={`
                px-4 py-2 rounded-xl border transition-all flex items-center gap-2
                ${category === key
                  ? `bg-primary-600/20 text-primary-400 border-primary-500`
                  : 'border-dark-border text-gray-400 hover:border-gray-600'
                }
              `}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notification */}
      <div>
        <label htmlFor="notify" className="block text-sm font-medium text-gray-300 mb-2">
          Remind Me
        </label>
        <select
          id="notify"
          value={notifyBefore || ''}
          onChange={(e) => setNotifyBefore(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Don't remind me</option>
          {NOTIFICATION_INTERVALS.map((interval) => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
        >
          {reminder ? 'Update Play' : 'Add Play'}
        </Button>
      </div>
    </form>
  );
}
