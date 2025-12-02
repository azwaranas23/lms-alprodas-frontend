import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

export interface StatusIconProps {
  status: 'success' | 'error' | 'warning' | 'loading';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600'
  },
  loading: {
    icon: Loader,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600 animate-spin'
  }
};

const iconSizes = {
  sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { container: 'w-12 h-12', icon: 'w-6 h-6' },
  lg: { container: 'w-16 h-16', icon: 'w-8 h-8' }
};

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 'lg'
}) => {
  const config = statusConfig[status];
  const sizes = iconSizes[size];
  const IconComponent = config.icon;

  return (
    <div className={`mx-auto ${sizes.container} ${config.bgColor} rounded-full flex items-center justify-center mb-6`}>
      <IconComponent className={`${sizes.icon} ${config.iconColor}`} />
    </div>
  );
};