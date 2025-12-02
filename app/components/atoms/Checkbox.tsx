import { type ChangeEvent, type ReactNode } from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  children,
  disabled = false,
  className = ''
}: CheckboxProps) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-[8px] focus:ring-blue-500 focus:ring-2 mt-0.5 cursor-pointer"
      />
      {children && (
        <div className="flex-1">
          {children}
        </div>
      )}
    </label>
  );
}