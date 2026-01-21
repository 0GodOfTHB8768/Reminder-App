import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { addHours, format, setHours, setMinutes } from 'date-fns';
import type { Reminder, Priority, Category } from '../../lib/types';
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../../lib/types';

interface ScanPreviewProps {
  imageData: string;
  extractedText: string;
  onSave: (data: Omit<Reminder, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onRetry: () => void;
  onCancel: () => void;
}

// Parse extracted text to find dates, times, priority, and title
function parseExtractedText(text: string) {
  const lines = text.split('\n').filter(line => line.trim());

  let parsedDate: Date | null = null;
  let parsedTime: { hours: number; minutes: number } | null = null;
  let parsedPriority: Priority = 'first-down';
  let titleLine = '';
  const descriptionLines: string[] = [];

  // Priority patterns (case insensitive)
  const priorityPatterns: { pattern: RegExp; priority: Priority }[] = [
    { pattern: /hail\s*mary/i, priority: 'hail-mary' },
    { pattern: /red\s*zone/i, priority: 'red-zone' },
    { pattern: /first\s*down/i, priority: 'first-down' },
    { pattern: /practice/i, priority: 'practice' },
  ];

  // Date patterns
  const monthNames = '(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)';
  const datePatterns = [
    // January 22nd 2026, January 22 2026, Jan 22nd 2026
    new RegExp(`(${monthNames})\\s+(\\d{1,2})(?:st|nd|rd|th)?[,\\s]+(\\d{4})`, 'i'),
    // 01/22/2026, 1/22/2026
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    // 2026-01-22
    /(\d{4})-(\d{2})-(\d{2})/,
  ];

  // Time patterns
  const timePatterns = [
    // 7:30 PM, 7:30PM, 7:30 pm
    /(\d{1,2}):(\d{2})\s*(am|pm)/i,
    // 19:30
    /(\d{1,2}):(\d{2})(?!\s*(?:am|pm))/i,
  ];

  const monthMap: Record<string, number> = {
    'january': 0, 'jan': 0,
    'february': 1, 'feb': 1,
    'march': 2, 'mar': 2,
    'april': 3, 'apr': 3,
    'may': 4,
    'june': 5, 'jun': 5,
    'july': 6, 'jul': 6,
    'august': 7, 'aug': 7,
    'september': 8, 'sep': 8,
    'october': 9, 'oct': 9,
    'november': 10, 'nov': 10,
    'december': 11, 'dec': 11,
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    let isSpecialLine = false;

    // Check for priority
    for (const { pattern, priority } of priorityPatterns) {
      if (pattern.test(trimmedLine)) {
        parsedPriority = priority;
        isSpecialLine = true;
        break;
      }
    }

    // Check for date
    if (!parsedDate) {
      for (const pattern of datePatterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          try {
            if (pattern.source.includes(monthNames)) {
              // Month name format
              const monthStr = match[1].toLowerCase();
              const day = parseInt(match[2]);
              const year = parseInt(match[3]);
              const month = monthMap[monthStr];
              if (month !== undefined) {
                parsedDate = new Date(year, month, day);
                isSpecialLine = true;
              }
            } else if (pattern.source.startsWith('(\\d{4})')) {
              // ISO format: YYYY-MM-DD
              parsedDate = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
              isSpecialLine = true;
            } else {
              // MM/DD/YYYY format
              parsedDate = new Date(parseInt(match[3]), parseInt(match[1]) - 1, parseInt(match[2]));
              isSpecialLine = true;
            }
          } catch {
            // Invalid date, continue
          }
          break;
        }
      }
    }

    // Check for time
    if (!parsedTime) {
      for (const pattern of timePatterns) {
        const match = trimmedLine.match(pattern);
        if (match) {
          let hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const meridiem = match[3]?.toLowerCase();

          if (meridiem) {
            // 12-hour format
            if (meridiem === 'pm' && hours !== 12) {
              hours += 12;
            } else if (meridiem === 'am' && hours === 12) {
              hours = 0;
            }
          }

          parsedTime = { hours, minutes };
          isSpecialLine = true;
          break;
        }
      }
    }

    // If not a special line, could be title or description
    if (!isSpecialLine) {
      if (!titleLine) {
        titleLine = trimmedLine;
      } else {
        descriptionLines.push(trimmedLine);
      }
    }
  }

  // Build the deadline
  let deadline: Date;
  if (parsedDate) {
    deadline = parsedDate;
    if (parsedTime) {
      deadline = setHours(setMinutes(deadline, parsedTime.minutes), parsedTime.hours);
    } else {
      // Default to end of day if no time specified
      deadline = setHours(setMinutes(deadline, 0), 17);
    }
  } else {
    // Default to tomorrow
    deadline = addHours(new Date(), 24);
    deadline.setMinutes(0);
  }

  return {
    title: titleLine || 'Scanned Reminder',
    description: descriptionLines.join('\n'),
    priority: parsedPriority,
    deadline: format(deadline, "yyyy-MM-dd'T'HH:mm"),
  };
}

export function ScanPreview({ imageData, extractedText, onSave, onRetry, onCancel }: ScanPreviewProps) {
  // Smart parse the extracted text
  const parsed = useMemo(() => parseExtractedText(extractedText), [extractedText]);

  const [title, setTitle] = useState(parsed.title);
  const [description, setDescription] = useState(parsed.description);
  const [priority, setPriority] = useState<Priority>(parsed.priority);
  const [category, setCategory] = useState<Category>('personal');
  const [deadline, setDeadline] = useState(parsed.deadline);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      category,
      deadline: new Date(deadline).toISOString(),
      notifyBefore: 30,
    });
  };

  const priorities = Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][];
  const categories = Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][];

  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 rounded-2xl p-4 md:p-6"
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Captured Image
          </h3>
          <img
            src={imageData}
            alt="Scanned bracelet notes"
            className="w-full rounded-xl border border-white/10 shadow-lg"
          />

          {/* Extracted text preview */}
          <div className="mt-4 p-4 bg-black/30 rounded-xl border border-white/10">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Detected Text
            </h4>
            <p className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
              {extractedText || 'No text detected'}
            </p>
          </div>

          {/* Retry button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="mt-4 w-full py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Scan Again
          </motion.button>
        </motion.div>

        {/* Edit Form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 rounded-2xl p-4 md:p-6 space-y-5"
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Create Reminder
          </h3>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details..."
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-colors resize-none"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deadline *
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-colors"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorities.map(([key, config]) => (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPriority(key)}
                  className={`
                    px-3 py-2 rounded-xl text-sm font-medium border transition-all
                    ${priority === key
                      ? `${config.bgColor} ${config.color} border-current`
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  {config.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(([key, config]) => (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCategory(key)}
                  className={`
                    px-3 py-2 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-1
                    ${category === key
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  <span>{config.icon}</span>
                  <span className="hidden sm:inline">{config.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-medium hover:bg-white/10 hover:text-white transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-bold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-shadow flex items-center justify-center gap-2"
            >
              <span>🏈</span>
              Save Play
            </motion.button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
