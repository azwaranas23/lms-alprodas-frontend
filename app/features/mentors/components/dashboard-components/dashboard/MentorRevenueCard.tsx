import { DollarSign, TrendingUp, Star } from 'lucide-react';

interface MentorRevenueCardProps {
  totalRevenue: string;
  monthlyGrowth: string;
  isGrowing?: boolean;
}

export function MentorRevenueCard({ 
  totalRevenue, 
  monthlyGrowth, 
  isGrowing = true 
}: MentorRevenueCardProps) {
  return (
    <div className="main-card lg:row-span-2 rounded-[20px] border border-[#0B1042] relative overflow-hidden p-5">
      <div className="flex flex-col justify-center h-full relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
            <TrendingUp className="w-3 h-3 text-white" />
            <span className="text-brand-white text-xs font-semibold">
              {monthlyGrowth} this month
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-brand-white-90 text-sm font-medium">Total Revenue</p>
            <p className="text-brand-white text-5xl font-extrabold leading-none my-4">
              {totalRevenue}
            </p>
            <p className="text-brand-white-80 text-base font-normal">Monthly earnings</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isGrowing ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-brand-white-70 text-xs font-normal">
              {isGrowing ? 'Growing' : 'Declining'} Revenue
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-white opacity-70" />
            <span className="text-brand-white-70 text-xs font-normal">Top Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
}