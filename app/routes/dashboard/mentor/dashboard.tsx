import { useState } from "react";
import { BookOpen, Users, CheckCircle, Banknote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mentor Dashboard - LMS Alprodas" },
    {
      name: "description",
      content: "Mentor dashboard overview with statistics and quick actions",
    },
  ];
}
import { MentorLayout } from "~/components/templates/MentorLayout";
import { MentorRoute } from "~/features/auth/components/RoleBasedRoute";
import { SearchSection } from "~/components/molecules/SearchSection";
import { StatsCard } from "~/components/atoms/StatsCard";
import { MentorRevenueCard } from "~/features/mentors/components/dashboard-components/dashboard/MentorRevenueCard";
import { MentorQuickActions } from "~/features/mentors/components/dashboard-components/dashboard/MentorQuickActions";
import { LatestTransactions } from "~/features/mentors/components/dashboard-components/dashboard/LatestTransactions";
import { LatestCourses } from "~/features/mentors/components/dashboard-components/dashboard/LatestCourses";

import { dashboardService } from "~/services/dashboard.service";
import { QUERY_KEYS } from "~/constants/api";
import { formatCurrencyCompact } from "~/utils/formatters";

export default function MentorDashboard() {
  const navigate = useNavigate();

  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: QUERY_KEYS.dashboard.stats,
    queryFn: dashboardService.getStats,
    retry: false,
  });

  // Fetch latest transactions
  const { data: transactions } = useQuery({
    queryKey: QUERY_KEYS.dashboard.transactions,
    queryFn: dashboardService.getLatestTransactions,
    retry: false,
  });

  // Fetch latest courses
  const { data: courses } = useQuery({
    queryKey: QUERY_KEYS.dashboard.courses,
    queryFn: dashboardService.getLatestCourses,
    retry: false,
  });

  const handleCreateCourse = () => {
    navigate("/dashboard/courses/add");
  };

  const handleRequestWithdrawal = () => {
    navigate("/dashboard/mentor/withdrawals/request");
  };

  const handleViewProfile = () => {
    console.log("View profile clicked");
  };

  const handleAccountSettings = () => {
    console.log("Account settings clicked");
  };

  const handleTransactionDetails = (id: string) => {
    console.log("Transaction details:", id);
  };

  const handleCourseDetails = (id: string) => {
    console.log("Course details:", id);
  };

  return (
    <MentorRoute>
      <MentorLayout
        title="Dashboard Overview"
        subtitle="Monitor your platform performance and learning metrics"
      >
        <main className="main-content flex-1 overflow-auto p-5">
          {/* Stats Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Revenue Card (spans 2 rows on the left) */}
            <MentorRevenueCard
              totalRevenue={formatCurrencyCompact(stats?.total_revenue || 0)}
              monthlyGrowth="+18.5%"
              isGrowing={true}
            />

            {/* Row 1 Stats Cards */}
            <StatsCard
              title="Active Courses"
              value={stats?.total_courses?.toString() || "0"}
              subtitle="+12 new courses"
              icon={BookOpen}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
              hasStatsCardClass={true}
            />

            <StatsCard
              title="Active Learners"
              value={stats?.total_students?.toLocaleString() || "0"}
              subtitle="+234 new students"
              icon={Users}
              iconBgColor="bg-green-50"
              iconColor="text-green-600"
            />

            {/* Quick Actions Card (spans 2 rows on the right) */}
            <MentorQuickActions
              onCreateCourse={handleCreateCourse}
              onRequestWithdrawal={handleRequestWithdrawal}
              onViewProfile={handleViewProfile}
              onAccountSettings={handleAccountSettings}
            />

            {/* Row 2 Stats Cards */}
            <StatsCard
              title="Completed Transactions"
              value={stats?.total_transactions?.toLocaleString() || "0"}
              subtitle="+156 this month"
              icon={CheckCircle}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />

            <StatsCard
              title="Total Withdrawals"
              value={formatCurrencyCompact(stats?.total_withdrawals || 0)}
              subtitle="+3 this month"
              icon={Banknote}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
          </div>

          {/* Search Section */}
          <SearchSection />

          {/* Latest Transactions and Courses Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <LatestTransactions
              transactions={transactions || []}
              onTransactionDetails={handleTransactionDetails}
            />

            <LatestCourses
              courses={courses || []}
              onCourseDetails={handleCourseDetails}
            />
          </div>
        </main>
      </MentorLayout>
    </MentorRoute>
  );
}
