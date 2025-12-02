
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const spinnerSizes = {
  sm: 'h-8 w-8',
  md: 'h-16 w-16',
  lg: 'h-32 w-32'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'lg',
  text = 'Loading...'
}) => {
  const spinnerClasses = spinnerSizes[size];

  return (
    <div className="text-center">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${spinnerClasses}`}></div>
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  );
};