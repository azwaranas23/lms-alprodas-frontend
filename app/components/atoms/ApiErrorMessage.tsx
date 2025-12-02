import { X } from 'lucide-react';

interface ApiError {
  path: string;
  message: string;
}

interface StructuredApiError {
  message: string;
  errors: ApiError[];
}

interface ApiErrorMessageProps {
  title?: string;
  message: string | StructuredApiError;
  className?: string;
}

export function ApiErrorMessage({ title = "Error", message, className = '' }: ApiErrorMessageProps) {
  if (!message) return null;

  // Safe rendering helper
  const renderSafeText = (text: any): string => {
    if (typeof text === 'string') return text;
    if (typeof text === 'object') return JSON.stringify(text);
    return String(text);
  };

  const isStructuredError = typeof message === 'object' && 'errors' in message && Array.isArray(message.errors);

  return (
    <div className={`rounded-[8px] p-4 mb-6 ${className}`} style={{ background: '#FEE2E2', border: '1px solid #F87171' }}>
      <div className="flex items-center gap-3">
        <X className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-danger text-sm font-semibold m-0">{title}</h4>
          {isStructuredError ? (
            <div>
              <p className="text-danger text-sm font-normal m-0 mb-2">
                {renderSafeText(message.message)}
              </p>
              {message.errors && message.errors.length > 0 && (
                <ul className="text-danger text-sm font-normal m-0 list-disc list-inside space-y-1">
                  {message.errors.map((error, index) => (
                    <li key={index}>
                      <span className="font-medium capitalize">{renderSafeText(error.path)}:</span> {renderSafeText(error.message)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-danger text-sm font-normal m-0 whitespace-pre-line">
              {renderSafeText(message)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}