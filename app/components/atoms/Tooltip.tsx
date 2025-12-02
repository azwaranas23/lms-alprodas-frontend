import { type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, children, className = '', align = 'center', position = 'top' }: TooltipProps) {
  // Don't show tooltip if content is empty or too short (likely won't truncate)
  if (!content || content.length < 30) {
    return <div className={className}>{children}</div>;
  }

  const alignmentClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0'
  };

  const arrowAlignmentClasses = {
    left: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-4'
  };

  const positionClasses = position === 'top'
    ? 'bottom-full mb-2'
    : 'top-full mt-2';

  const arrowPositionClasses = position === 'top'
    ? 'top-full border-t-8 border-t-gray-900 border-x-8 border-x-transparent'
    : 'bottom-full border-b-8 border-b-gray-900 border-x-8 border-x-transparent';

  return (
    <div className={`group relative ${className}`}>
      {children}

      <div className={`absolute z-[9999] ${positionClasses} ${alignmentClasses[align]} px-3 py-2.5 text-xs leading-relaxed text-white bg-gray-900 rounded-lg shadow-xl max-w-xs pointer-events-none whitespace-normal break-words opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
        {content}
        <div className={`absolute ${arrowAlignmentClasses[align]} ${arrowPositionClasses} w-0 h-0`} />
      </div>
    </div>
  );
}