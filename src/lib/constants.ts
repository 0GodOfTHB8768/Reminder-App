export const APP_NAME = "Game Day Tracker";

export const NOTIFICATION_INTERVALS = [
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
  { value: 120, label: '2 hours before' },
  { value: 1440, label: '1 day before' }
] as const;

export const URGENCY_THRESHOLDS = {
  CRITICAL: 60, // Less than 1 hour
  URGENT: 180, // Less than 3 hours
  SOON: 1440, // Less than 24 hours
  UPCOMING: 4320 // Less than 3 days
} as const;

export const FOOTBALL_QUOTES = [
  "Every play counts!",
  "Stay in the game!",
  "Time to score!",
  "Don't fumble this one!",
  "Drive down the field!",
  "Eyes on the end zone!",
  "Make every second count!",
  "You've got this, quarterback!"
];

export function getRandomQuote(): string {
  return FOOTBALL_QUOTES[Math.floor(Math.random() * FOOTBALL_QUOTES.length)];
}
