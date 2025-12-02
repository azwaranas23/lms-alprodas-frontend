import { BookPlus, Layers, UserCheck, CreditCard } from 'lucide-react';
import { Button } from '~/components/atoms/Button';

interface QuickActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isPrimary?: boolean;
}

function QuickActionButton({ icon: Icon, label, isPrimary = false }: QuickActionButtonProps) {
  return (
    <Button
      variant={isPrimary ? "primary" : "secondary"}
      className={`w-full text-left justify-start ${isPrimary ? 'rounded-[12px] px-4 py-3' : 'rounded-[16px] hover:rounded-[12px] px-4 py-3'}`}
    >
      <Icon className={`w-4 h-4 ${isPrimary ? 'text-white' : 'text-gray-600'}`} />
      <span className={`text-sm font-${isPrimary ? 'semibold text-brand-white' : 'medium text-brand-dark'}`}>
        {label}
      </span>
    </Button>
  );
}

export function QuickActions() {
  return (
    <div className="lg:row-span-2 bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
      <h3 className="text-brand-dark text-lg font-bold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <QuickActionButton icon={BookPlus} label="Add Course" isPrimary />
        <QuickActionButton icon={Layers} label="Create Subject" />
        <QuickActionButton icon={UserCheck} label="Approve Mentor" />
        <QuickActionButton icon={CreditCard} label="Process Payment" />
      </div>
    </div>
  );
}