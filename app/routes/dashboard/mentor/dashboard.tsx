import { BookOpen, Users, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { Route } from "./+types/dashboard";

import { MentorLayout } from "~/components/templates/MentorLayout";
import { MentorRoute } from "~/features/auth/components/RoleBasedRoute";
import { SearchSection } from "~/components/molecules/SearchSection";
import { StatsCard } from "~/components/atoms/StatsCard";
import { MentorQuickActions } from "~/features/mentors/components/dashboard-components/dashboard/MentorQuickActions";
import { LatestCourses } from "~/features/mentors/components/dashboard-components/dashboard/LatestCourses";

import { dashboardService } from "~/services/dashboard.service";
import { QUERY_KEYS } from "~/constants/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mentor Dashboard - LMS Alprodas" },
    {
      name: "description",
      content: "Mentor dashboard overview with statistics and quick actions",
    },
  ];
}

export default function MentorDashboard() {
  const navigate = useNavigate();

  // Stats khusus mentor
  const { data: stats } = useQuery({
    queryKey: QUERY_KEYS.dashboard.stats,
    queryFn: dashboardService.getStats,
    retry: false,
  });

  // Latest courses yang dibuat mentor
  const { data: courses } = useQuery({
    queryKey: QUERY_KEYS.dashboard.courses,
    queryFn: dashboardService.getLatestCourses,
    retry: false,
  });

  const handleCreateCourse = () => {
    navigate("/dashboard/mentor/courses/add");
  };

  const handleViewStudents = () => {
    navigate("/dashboard/mentor/students");
  };

  const handleViewProfile = () => {
    console.log("View profile clicked");
  };

  const handleAccountSettings = () => {
    console.log("Account settings clicked");
  };

  const handleCourseDetails = (id: string) => {
    console.log("Course details:", id);
    navigate(`/dashboard/mentor/courses/${id}`);
  };

  return (
    <MentorRoute>
      <MentorLayout
        title="Dashboard Overview"
        subtitle="Monitor your teaching performance and learner progress"
      >
        <main className="main-content flex-1 overflow-auto p-5">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatsCard
              title="My Courses"
              value={stats?.total_courses?.toString() || "0"}
              subtitle="Total published courses"
              icon={BookOpen}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
              hasStatsCardClass={true}
            />

            <StatsCard
              title="Active Learners"
              value={stats?.total_students?.toLocaleString() || "0"}
              subtitle="Students enrolled in your courses"
              icon={Users}
              iconBgColor="bg-green-50"
              iconColor="text-green-600"
            />

            <StatsCard
              title="Total Enrollments"
              value={stats?.total_transactions?.toLocaleString() || "0"}
              subtitle="All enrollments across your courses"
              icon={CheckCircle}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
          </div>

          {/* Quick Actions (tanpa Request Withdrawal) */}
          <div className="mb-6">
            <MentorQuickActions
              onCreateCourse={handleCreateCourse}
              // prop ini sekarang dipakai untuk "View Students"
              onRequestWithdrawal={handleViewStudents}
              onViewProfile={handleViewProfile}
              onAccountSettings={handleAccountSettings}
            />
          </div>

          {/* Search bar */}
          <SearchSection />

          {/* Latest Courses saja (tanpa Latest Transactions) */}
          <div className="grid grid-cols-1 gap-4 mb-6">
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
