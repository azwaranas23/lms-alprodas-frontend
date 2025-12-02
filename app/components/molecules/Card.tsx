export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5'
};

export function Card({ children, className = '', hover = false, padding = 'lg' }: CardProps) {
  const hoverClasses = hover ? 'hover:border-[#0C51D9] hover:border-2 hover:shadow-lg transition-all duration-300' : '';
  const paddingClass = paddingClasses[padding];

  return (
    <div className={`bg-white border border-[#DCDEDD] rounded-[20px] ${hoverClasses} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}