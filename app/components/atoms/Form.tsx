import { type FormHTMLAttributes, type ReactNode } from 'react';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
}

export function Form({ children, isLoading, error, className = '', ...props }: FormProps) {
  return (
    <form
      className={`${className} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      {...props}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {children}
    </form>
  );
}