import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../atoms/Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl'
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  size = 'lg',
  className = ''
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-[20px] border border-[#DCDEDD] w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-hidden ${className}`}>
        <div className="p-6 border-b border-[#DCDEDD]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                  {icon}
                </div>
              )}
              <div>
                <h3 className="text-brand-dark text-xl font-bold">{title}</h3>
                {subtitle && (
                  <p className="text-brand-light text-sm font-normal">{subtitle}</p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="w-10 h-10 rounded-full p-0"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}