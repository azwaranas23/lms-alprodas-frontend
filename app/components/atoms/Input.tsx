import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'search';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, variant = 'default', className = '', style, ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-3 border transition-all duration-300 font-semibold focus:outline-none bg-white';
    const variantClasses = {
      default: 'rounded-[8px]',
      search: 'rounded-[16px]'
    };

    const borderClasses = error
      ? 'border-2'
      : 'border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white';

    const paddingClasses = icon ? 'pl-12' : '';

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${borderClasses} ${paddingClasses} ${className}`;

    const inputStyle = error ? { ...style, borderColor: '#DC2626' } : style;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            style={inputStyle}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-danger">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';