import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-primary-container hover:bg-primary-dark text-on-primary-container shadow-[0_2px_8px_rgba(8,119,204,0.25)] hover:shadow-md active:scale-98',
    secondary:
      'bg-surface-container-lowest hover:bg-surface-light-blue text-primary border border-border-subtle shadow-xs',
    outline:
      'bg-transparent border border-primary text-primary hover:bg-surface-light-blue',
    ghost:
      'bg-transparent hover:bg-surface-soft-blue text-on-surface-variant hover:text-primary',
    success:
      'bg-success hover:bg-success-text text-white shadow-[0_4px_16px_rgba(24,168,116,0.3)]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : (
        icon && iconPosition === 'left' && (
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        )
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
    </button>
  );
};
