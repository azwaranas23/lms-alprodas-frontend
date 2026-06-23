export type BadgeVariant = 'success' | 'pending' | 'failed' | 'expert' | 'creative' | 'high-performing';

export interface BadgeProps {
  readonly variant: BadgeVariant;
  readonly children: React.ReactNode;
  readonly className?: string;
}

const badgeVariants = {
  success: 'badge-expert',
  paid: 'badge-expert',
  pending: 'badge-creative',
  failed: 'badge-high-performing',
  expert: 'badge-expert',
  creative: 'badge-creative',
  'high-performing': 'badge-high-performing'
};

export function Badge({ variant, children, className = '' }: Readonly<BadgeProps>) {
  const variantClass = badgeVariants[variant] || badgeVariants.expert;

  return (
    <span className={`${variantClass} px-2 py-1 rounded-md text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}