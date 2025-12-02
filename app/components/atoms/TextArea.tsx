import { forwardRef, type TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, resize = 'vertical', className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-4 py-3 border transition-all duration-300 font-semibold focus:outline-none';
    const defaultClasses = 'border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white';
    const errorClasses = error ? 'border-red-500 hover:border-red-500 focus:border-red-500' : '';
    const resizeClasses = `resize-${resize}`;

    const textareaClasses = `${baseClasses} ${defaultClasses} ${errorClasses} ${resizeClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaClasses}
          rows={4}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';