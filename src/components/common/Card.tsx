import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'highlighted';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'bg-dark-card border-dark-border',
  elevated: 'bg-dark-card border-dark-border shadow-lg shadow-black/20',
  highlighted: 'bg-dark-card border-primary-600/50 shadow-lg shadow-primary-600/10'
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  animate = true,
  className = ''
}: CardProps) {
  const baseClassName = `
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    rounded-xl border
    ${className}
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        className={baseClassName}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClassName}>
      {children}
    </div>
  );
}
