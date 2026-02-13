import { useState, useCallback } from 'react';

const TOUR_COMPLETED_KEY = 'gameday-tour-completed';

export function useIntroTour() {
  const [showTour, setShowTour] = useState(() => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    return !completed;
  });
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    return !!completed;
  });

  const completeTour = useCallback(() => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
  }, []);

  const openTour = useCallback(() => {
    setShowTour(true);
  }, []);

  return {
    showTour,
    hasSeenTour,
    completeTour,
    openTour
  };
}
