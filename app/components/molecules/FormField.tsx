import { type ReactNode, type InputHTMLAttributes } from 'react';
import { ErrorMessage } from '../atoms/ErrorMessage';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required = false, error, children, className = '' }: FormFieldProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-brand-dark text-base font-semibold mb-1">
        {label} {required && '*'}
      </label>
      {children}
      <ErrorMessage message={error} />
    </div>
  );
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: ReactNode;
}

export function FormInput({ error, icon, className = '', ...props }: FormInputProps) {
  const baseClasses = 'w-full pr-4 py-3 bg-white border rounded-[16px] focus:bg-white transition-all duration-300 font-semibold';
  const errorClasses = error
    ? 'border-[#DC2626] border-2'
    : 'border-[#DCDEDD] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2';
  const paddingClasses = icon ? 'pl-12' : 'pl-4';

  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        className={`${baseClasses} ${errorClasses} ${paddingClasses} ${className}`}
        {...props}
      />
    </div>
  );
}