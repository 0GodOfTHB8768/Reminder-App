import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface IntroTourProps {
  isVisible: boolean;
  onComplete: () => void;
}

interface TourStep {
  title: string;
  emoji: string;
  term: string;
  meaning: string;
  gradient: string;
  glowColor: string;
}

const tourSteps: TourStep[] = [
  {
    title: 'Welcome to Game Day!',
    emoji: '🏈',
    term: 'Welcome',
    meaning: 'Your personal deadline tracker with a football twist! Let me show you how we keep score around here.',
    gradient: 'from-green-600 to-green-400',
    glowColor: 'rgba(32, 55, 49, 0.5)'
  },
  {
    title: 'Touchdown!',
    emoji: '🏈',
    term: 'Touchdown',
    meaning: 'When you complete a task ON TIME, you score a Touchdown! That\'s 7 points and the best way to win.',
    gradient: 'from-green-500 to-emerald-400',
    glowColor: 'rgba(34, 197, 94, 0.4)'
  },
  {
    title: 'Field Goal',
    emoji: '🥅',
    term: 'Field Goal',
    meaning: 'Completed a task but missed the deadline? That\'s a Field Goal - 3 points. Better late than never!',
    gradient: 'from-yellow-500 to-amber-400',
    glowColor: 'rgba(255, 182, 18, 0.5)'
  },
  {
    title: 'Turnover',
    emoji: '💨',
    term: 'Turnover',
    meaning: 'A missed deadline that you didn\'t complete. Try to avoid these - they hurt your win rate!',
    gradient: 'from-red-500 to-orange-400',
    glowColor: 'rgba(239, 68, 68, 0.4)'
  },
  {
    title: 'Win Streak',
    emoji: '🔥',
    term: 'Streak',
    meaning: 'Complete tasks on time in a row to build your streak! How many consecutive Touchdowns can you score?',
    gradient: 'from-yellow-400 to-amber-500',
    glowColor: 'rgba(255, 182, 18, 0.5)'
  },
  {
    title: 'You\'re Ready!',
    emoji: '🏆',
    term: 'Game On',
    meaning: 'Now you know the playbook! Add your first deadline and start scoring. Good luck, champion!',
    gradient: 'from-green-500 to-yellow-400',
    glowColor: 'rgba(46, 125, 50, 0.5)'
  }
];

export function IntroTour({ isVisible, onComplete }: IntroTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  // Reset step when tour opens
  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
    }
  }, [isVisible]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Tour Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md"
          >
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-50"
              style={{ background: step.glowColor }}
            />

            {/* Card content */}
            <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              {/* Top gradient bar */}
              <div className={`h-1 bg-gradient-to-r ${step.gradient}`} />

              {/* Content */}
              <div className="p-8 text-center">
                {/* Emoji */}
                <motion.div
                  key={`emoji-${currentStep}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                  className="text-7xl mb-6"
                >
                  {step.emoji}
                </motion.div>

                {/* Term badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r ${step.gradient} text-white font-bold text-sm mb-4`}
                >
                  {step.term}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className={`text-2xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent mb-4`}
                >
                  {step.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-300 text-lg leading-relaxed mb-8"
                >
                  {step.meaning}
                </motion.p>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {tourSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? `bg-gradient-to-r ${step.gradient} w-6`
                          : index < currentStep
                            ? 'bg-white/50'
                            : 'bg-white/20'
                      }`}
                      animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  {!isLastStep && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSkip}
                      className="flex-1 py-3 px-4 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                    >
                      Skip Tour
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className={`flex-1 py-3 px-6 rounded-xl bg-gradient-to-r ${step.gradient} text-white font-bold shadow-lg transition-all relative overflow-hidden`}
                    style={{ boxShadow: `0 0 20px ${step.glowColor}` }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700" />
                    <span className="relative">
                      {isLastStep ? "Let's Go!" : 'Next'}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Step counter */}
              <div className="pb-4 text-center">
                <span className="text-sm text-gray-500">
                  {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Hook to manage tour state with localStorage
const TOUR_COMPLETED_KEY = 'gameday-tour-completed';

export function useIntroTour() {
  const [showTour, setShowTour] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(true); // Default to true to prevent flash

  useEffect(() => {
    // Check localStorage on mount
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!completed) {
      setShowTour(true);
      setHasSeenTour(false);
    }
  }, []);

  const completeTour = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
  };

  const openTour = () => {
    setShowTour(true);
  };

  return {
    showTour,
    hasSeenTour,
    completeTour,
    openTour
  };
}
