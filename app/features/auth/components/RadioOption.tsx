import { type ReactNode } from 'react';

interface RadioOptionProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  icon: ReactNode;
  label: string;
  description?: string;
  required?: boolean;
}

export function RadioOption({
  name,
  value,
  checked,
  onChange,
  icon,
  label,
  description,
  required = false
}: Readonly<RadioOptionProps>) {
  const inputId = `radio-${name}-${value}`;
  return (
    <label htmlFor={inputId} className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
      <span className="sr-only">{label}</span>
      <span className="flex items-center gap-3">
        <span className="w-8 h-8 bg-blue-50 rounded-[12px] flex items-center justify-center">
          {icon}
        </span>
        <span className="flex flex-col">
          <span className="text-brand-dark text-sm font-semibold">{label}</span>
          {description && <span className="text-brand-light text-xs mt-0.5">{description}</span>}
        </span>
      </span>
      <span className="relative flex items-center justify-center w-fit h-6 shrink-0">
        <input
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          required={required}
        />
        <span className="flex size-[16px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[4px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></span>
      </span>
    </label>
  );
}