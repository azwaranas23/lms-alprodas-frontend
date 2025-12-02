
interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <p className="text-danger text-sm font-normal">
        {message}
      </p>
    </div>
  );
}