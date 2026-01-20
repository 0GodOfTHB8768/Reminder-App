import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'custom';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-500/20 text-gray-300',
  primary: 'bg-primary-500/20 text-primary-400',
  success: 'bg-field-500/20 text-field-400',
  warning: 'bg-warning-500/20 text-warning-500',
  danger: 'bg-danger-500/20 text-danger-500',
  custom: ''
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm'
};

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        inline-flex items-center font-medium rounded-full
        ${className}
      `}
    >
      {children}
    </span>
  );
}
