import { forwardRef, type ButtonHTMLAttributes } from 'react';

/**
 * Props for the Button component
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in loading state */
  isLoading?: boolean;
  /** Button content */
  children: React.ReactNode;
}

const buttonVariants = {
  primary: 'btn-primary border border-[#2151A0] blue-gradient blue-btn-shadow text-white hover:brightness-110',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200',
  outline: 'border border-[#DCDEDD] bg-white text-brand-dark hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50',
  danger: 'bg-red-500 text-white border border-red-600 hover:bg-red-600',
  ghost: 'text-brand-dark hover:bg-gray-50'
};

const buttonSizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

/**
 * A reusable button component with multiple variants, sizes, and loading state support.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * <Button variant="outline" isLoading={isSubmitting}>
 *   Submit
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className = '', disabled, ...props }, ref) => {
    const baseClasses = 'rounded-lg font-medium transition-all duration-300 focus:ring-2 focus:ring-[#0C51D9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
    const variantClasses = buttonVariants[variant];
    const sizeClasses = buttonSizes[size];

    return (
      <button
        ref={ref}
        type="button"
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';