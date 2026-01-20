import { useState, useEffect } from 'react';
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays, parseISO, isBefore } from 'date-fns';
import { URGENCY_THRESHOLDS } from '../lib/constants';

export type UrgencyLevel = 'critical' | 'urgent' | 'soon' | 'upcoming' | 'normal' | 'overdue';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
  isOverdue: boolean;
  urgencyLevel: UrgencyLevel;
  displayText: string;
}

export function useCountdown(deadline: string): CountdownResult {
  const [countdown, setCountdown] = useState<CountdownResult>(() => calculateCountdown(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(deadline));
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return countdown;
}

function calculateCountdown(deadline: string): CountdownResult {
  const now = new Date();
  const deadlineDate = parseISO(deadline);
  const isOverdue = isBefore(deadlineDate, now);

  if (isOverdue) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMinutes: 0,
      isOverdue: true,
      urgencyLevel: 'overdue',
      displayText: 'Overdue!'
    };
  }

  const totalSeconds = differenceInSeconds(deadlineDate, now);
  const totalMinutes = differenceInMinutes(deadlineDate, now);
  const days = differenceInDays(deadlineDate, now);
  const hours = differenceInHours(deadlineDate, now) % 24;
  const minutes = differenceInMinutes(deadlineDate, now) % 60;
  const seconds = totalSeconds % 60;

  const urgencyLevel = getUrgencyLevel(totalMinutes);
  const displayText = formatCountdown(days, hours, minutes, seconds);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMinutes,
    isOverdue,
    urgencyLevel,
    displayText
  };
}

function getUrgencyLevel(totalMinutes: number): UrgencyLevel {
  if (totalMinutes <= URGENCY_THRESHOLDS.CRITICAL) return 'critical';
  if (totalMinutes <= URGENCY_THRESHOLDS.URGENT) return 'urgent';
  if (totalMinutes <= URGENCY_THRESHOLDS.SOON) return 'soon';
  if (totalMinutes <= URGENCY_THRESHOLDS.UPCOMING) return 'upcoming';
  return 'normal';
}

function formatCountdown(days: number, hours: number, minutes: number, seconds: number): string {
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function getUrgencyColor(level: UrgencyLevel): string {
  switch (level) {
    case 'critical':
    case 'overdue':
      return 'text-danger-500';
    case 'urgent':
      return 'text-warning-500';
    case 'soon':
      return 'text-leather-400';
    case 'upcoming':
      return 'text-primary-400';
    default:
      return 'text-field-400';
  }
}

export function getUrgencyBgColor(level: UrgencyLevel): string {
  switch (level) {
    case 'critical':
    case 'overdue':
      return 'bg-danger-500/20';
    case 'urgent':
      return 'bg-warning-500/20';
    case 'soon':
      return 'bg-leather-400/20';
    case 'upcoming':
      return 'bg-primary-400/20';
    default:
      return 'bg-field-400/20';
  }
}
