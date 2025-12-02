import { PlusCircle, DollarSign, User, Settings } from 'lucide-react';
import { Button } from '~/components/atoms/Button';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
}

interface MentorQuickActionsProps {
  onCreateCourse?: () => void;
  onRequestWithdrawal?: () => void;
  onViewProfile?: () => void;
  onAccountSettings?: () => void;
}

export function MentorQuickActions({
  onCreateCourse,
  onRequestWithdrawal,
  onViewProfile,
  onAccountSettings
}: MentorQuickActionsProps) {
  const actions: QuickAction[] = [
    {
      icon: PlusCircle,
      label: 'Create Course',
      onClick: onCreateCourse || (() => {}),
      isPrimary: true
    },
    {
      icon: DollarSign,
      label: 'Request Withdrawal',
      onClick: onRequestWithdrawal || (() => {})
    },
    {
      icon: User,
      label: 'View Profile',
      onClick: onViewProfile || (() => {})
    },
    {
      icon: Settings,
      label: 'Account Settings',
      onClick: onAccountSettings || (() => {})
    }
  ];

  return (
    <div className="lg:row-span-2 bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
      <h3 className="text-brand-dark text-lg font-bold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isPrimary = action.isPrimary;
          
          return (
            <Button
              key={index}
              onClick={action.onClick}
              variant={isPrimary ? 'primary' : 'outline'}
              className="w-full text-left px-4 py-3"
            >
              <Icon className={`w-4 h-4 ${isPrimary ? 'text-white' : 'text-gray-600'}`} />
              <span className={`text-sm font-semibold ${isPrimary ? 'text-white' : 'text-brand-dark font-medium'}`}>
                {action.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}