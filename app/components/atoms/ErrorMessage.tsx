
interface ErrorMessageProps {
  readonly message?: string;
  readonly className?: string;
}

export function ErrorMessage({ message, className = '' }: Readonly<ErrorMessageProps>) {
  if (!message) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <p className="text-danger text-sm font-normal">
        {message}
      </p>
    </div>
  );
}