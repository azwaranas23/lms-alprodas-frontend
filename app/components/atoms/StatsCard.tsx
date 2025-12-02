interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  hasStatsCardClass?: boolean;
}

export function StatsCard({ title, value, subtitle, icon: Icon, iconBgColor, iconColor, hasStatsCardClass = false }: StatsCardProps) {
  return (
    <div className={`${hasStatsCardClass ? 'stats-card ' : ''}bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-brand-dark text-sm font-medium">{title}</p>
          <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">{value}</p>
          <p className="text-success text-sm font-medium">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-[16px] flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}