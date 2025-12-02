import { TrendingUp, DollarSign, Star } from 'lucide-react';

interface RevenueCardProps {
  totalRevenue?: number;
}

export function RevenueCard({ totalRevenue = 0 }: RevenueCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      // Milyar
      return `Rp ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      // Juta
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      // Ribu
      return `Rp ${(amount / 1000).toFixed(1)}K`;
    } else {
      // Kurang dari ribu
      return `Rp ${amount}`;
    }
  };
  return (
    <div className="main-card lg:row-span-2 rounded-[20px] border border-[#0B1042] relative overflow-hidden p-5">
      <div className="flex flex-col justify-center h-full relative z-10">
        {/* Trending Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 text-white" />
            <span className="text-white text-xs font-semibold">+18.5% this month</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-brand-white-90 text-sm font-medium">Total Revenue</p>
            <p className="text-brand-white text-5xl font-extrabold leading-none my-4">{formatCurrency(totalRevenue)}</p>
            <p className="text-brand-white-80 text-base font-normal">Monthly earnings</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-brand-white-70 text-xs font-normal">Growing Revenue</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-white opacity-70" />
            <span className="text-white opacity-70 text-xs font-normal">Top Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
}