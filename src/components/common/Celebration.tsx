import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface CelebrationProps {
  type: 'touchdown' | 'field-goal';
  isVisible: boolean;
  onComplete: () => void;
}

interface Particle {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  scale: number;
  rotation: number;
}

interface Confetti {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
}

const celebrationConfig = {
  touchdown: {
    title: 'TOUCHDOWN!',
    subtitle: 'You scored! On time completion!',
    emoji: '🏈',
    gradient: 'from-green-500 to-emerald-400',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    bgGradient: 'from-green-500/30 via-emerald-500/20 to-green-500/30',
    particles: ['🎉', '⭐', '🏈', '🔥', '💪', '🏆', '✨', '🎊'],
    confettiColors: ['#22c55e', '#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b']
  },
  'field-goal': {
    title: 'Field Goal!',
    subtitle: 'Points on the board! Better late than never.',
    emoji: '🥅',
    gradient: 'from-amber-500 to-yellow-400',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    bgGradient: 'from-amber-500/30 via-yellow-500/20 to-amber-500/30',
    particles: ['👍', '✅', '🥅', '⭐', '👏'],
    confettiColors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a']
  }
};

export function Celebration({ type, isVisible, onComplete }: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const config = celebrationConfig[type];

  // Generate particles and confetti
  useEffect(() => {
    if (isVisible) {
      // Emoji particles
      const newParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        emoji: config.particles[Math.floor(Math.random() * config.particles.length)],
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        scale: 0.8 + Math.random() * 0.8,
        rotation: Math.random() * 360
      }));
      setParticles(newParticles);

      // Confetti pieces
      const newConfetti: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: config.confettiColors[Math.floor(Math.random() * config.confettiColors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1
      }));
      setConfetti(newConfetti);

      // Auto dismiss after 3 seconds
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete, config.particles, config.confettiColors]);

  // Memoize sparkle positions
  const sparkles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      delay: Math.random() * 2,
      size: 4 + Math.random() * 8
    })),
    []
  );

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {/* Background with radial gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${config.glowColor} 0%, rgba(0,0,0,0.8) 70%)`
            }}
          />

          {/* Confetti pieces */}
          {confetti.map((piece) => (
            <motion.div
              key={`confetti-${piece.id}`}
              initial={{
                opacity: 1,
                y: -20,
                x: `${piece.x}vw`,
                rotate: 0,
                scale: 1
              }}
              animate={{
                opacity: [1, 1, 0],
                y: '110vh',
                rotate: Math.random() > 0.5 ? 720 : -720,
                scale: [1, 1, 0.5]
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: 'linear'
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: piece.color }}
            />
          ))}

          {/* Emoji particles */}
          {particles.map((particle) => (
            <motion.div
              key={`particle-${particle.id}`}
              initial={{
                opacity: 0,
                y: '60vh',
                x: `${particle.x}vw`,
                scale: 0,
                rotate: 0
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: '-10vh',
                scale: [0, particle.scale, particle.scale, 0],
                rotate: particle.rotation
              }}
              transition={{
                duration: 2.5,
                delay: particle.delay,
                ease: 'easeOut'
              }}
              className="absolute text-4xl"
              style={{ fontSize: `${2 + particle.scale}rem` }}
            >
              {particle.emoji}
            </motion.div>
          ))}

          {/* Main celebration card */}
          <motion.div
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 10, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15
            }}
            className="relative"
          >
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-60"
              style={{ background: `linear-gradient(135deg, ${config.glowColor}, transparent)` }}
            />

            {/* Card */}
            <div className={`
              relative bg-gradient-to-br ${config.bgGradient}
              backdrop-blur-xl border border-white/20 rounded-3xl p-10
              shadow-2xl overflow-hidden
            `}>
              {/* Sparkles */}
              {sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                    width: sparkle.size,
                    height: sparkle.size
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: sparkle.delay,
                    repeat: Infinity
                  }}
                />
              ))}

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: '-200%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />

              <div className="relative text-center">
                {/* Bouncing emoji */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: 3,
                    repeatType: 'reverse'
                  }}
                  className="text-8xl mb-6 filter drop-shadow-lg"
                >
                  {config.emoji}
                </motion.div>

                {/* Title with gradient */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-5xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-3`}
                >
                  {config.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-white/80 font-medium"
                >
                  {config.subtitle}
                </motion.p>

                {/* Points indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className={`
                    inline-flex items-center gap-2 mt-6 px-6 py-2 rounded-full
                    bg-white/10 border border-white/20
                  `}
                >
                  <span className="text-2xl">+</span>
                  <span className={`text-3xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                    {type === 'touchdown' ? '7' : '3'}
                  </span>
                  <span className="text-lg text-white/60">pts</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Corner bursts */}
          {[0, 1, 2, 3].map((corner) => (
            <motion.div
              key={corner}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1, delay: 0.1 * corner }}
              className={`absolute w-40 h-40 rounded-full bg-gradient-to-r ${config.gradient}`}
              style={{
                top: corner < 2 ? '-5%' : 'auto',
                bottom: corner >= 2 ? '-5%' : 'auto',
                left: corner % 2 === 0 ? '-5%' : 'auto',
                right: corner % 2 === 1 ? '-5%' : 'auto',
                filter: 'blur(40px)'
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
