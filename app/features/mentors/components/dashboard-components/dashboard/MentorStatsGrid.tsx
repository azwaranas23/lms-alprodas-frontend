import { BookOpen, Users, CheckCircle, Banknote } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
  isFirstCard?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, iconBgColor, iconColor, isFirstCard = false }: StatCardProps) {
  const cardClass = isFirstCard 
    ? "stats-card bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5"
    : "bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5";

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-brand-dark text-sm font-medium">{title}</p>
          <p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
            {value}
          </p>
          <p className="text-success text-sm font-medium">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-[16px] flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

interface MentorStatsGridProps {
  activeCourses: number;
  newCourses: number;
  activeStudents: number;
  newStudents: number;
  completedTransactions: number;
  monthlyTransactions: number;
  totalWithdrawals: number;
  monthlyWithdrawals: number;
}

export function MentorStatsGrid({
  activeCourses,
  newCourses,
  activeStudents,
  newStudents,
  completedTransactions,
  monthlyTransactions,
  totalWithdrawals,
  monthlyWithdrawals
}: MentorStatsGridProps) {
  return (
    <>
      <StatCard
        title="Active Courses"
        value={activeCourses}
        subtitle={`+${newCourses} new courses`}
        icon={BookOpen}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
        isFirstCard={true}
      />
      
      <StatCard
        title="Active Learners"
        value={activeStudents.toLocaleString()}
        subtitle={`+${newStudents} new students`}
        icon={Users}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
      
      <StatCard
        title="Completed Transactions"
        value={completedTransactions.toLocaleString()}
        subtitle={`+${monthlyTransactions} this month`}
        icon={CheckCircle}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      
      <StatCard
        title="Total Withdrawals"
        value={totalWithdrawals}
        subtitle={`+${monthlyWithdrawals} this month`}
        icon={Banknote}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
    </>
  );
}