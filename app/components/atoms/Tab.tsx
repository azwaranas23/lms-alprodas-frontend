import { type ReactNode } from 'react';

interface TabProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Tab({ children, isActive = false, onClick, className = '' }: TabProps) {
  const baseClass = "flex items-center gap-2 px-4 py-3 rounded-[12px] border-2 font-semibold transition-all duration-300 cursor-pointer";

  const activeClass = "border-[#0C51D9] bg-[#0C51D9] text-white hover:bg-[#1e5beb]";
  const inactiveClass = "border-[#DCDEDD] bg-white text-brand-dark font-medium hover:border-[#0C51D9] hover:bg-gray-50";

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${isActive ? activeClass : inactiveClass} ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}