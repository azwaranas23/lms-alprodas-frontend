import { BookOpen, Users, CheckCircle, UserCheck } from "lucide-react";
import { Layout } from "~/components/templates/Layout";
import { StatsCard } from "~/components/atoms/StatsCard";
import { SearchSection } from "~/components/molecules/SearchSection";
import { RevenueCard } from "./RevenueCard";
import { QuickActions } from "./QuickActions";
import { LatestTransactions } from "~/components/organisms/LatestTransactions";
import { LatestUsers } from "./LatestUsers";
import { useDashboard } from "~/hooks/useDashboard";

export function Overview() {
	const { stats, latestUsers, latestTransactions, loading, error } =
		useDashboard();

	if (loading) {
		return (
			<Layout
				title="Dashboard Overview"
				subtitle="Monitor your platform performance and learning metrics"
			>
				<main className="main-content flex-1 overflow-auto p-5">
					<div className="flex items-center justify-center h-64">
						<div className="text-gray-500">
							Loading dashboard data...
						</div>
					</div>
				</main>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout
				title="Dashboard Overview"
				subtitle="Monitor your platform performance and learning metrics"
			>
				<main className="main-content flex-1 overflow-auto p-5">
					<div className="flex items-center justify-center h-64">
						<div className="text-red-500">Error: {error}</div>
					</div>
				</main>
			</Layout>
		);
	}
	return (
		<Layout
			title="Dashboard Overview"
			subtitle="Monitor your platform performance and learning metrics"
		>
			<main className="main-content flex-1 overflow-auto p-5">
				{/* Stats Layout */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					{/* Total Revenue Card (spans 2 rows on the left) */}
					<RevenueCard totalRevenue={stats?.total_revenue || 0} />

					{/* Row 1 Stats Cards */}
					<StatsCard
						title="Total Courses"
						value={stats?.total_courses?.toString() || "0"}
						subtitle="Available courses"
						icon={BookOpen}
						iconBgColor="bg-blue-50"
						iconColor="text-blue-600"
						hasStatsCardClass={true}
					/>

					<StatsCard
						title="Total Students"
						value={stats?.total_students?.toString() || "0"}
						subtitle="Registered students"
						icon={Users}
						iconBgColor="bg-green-50"
						iconColor="text-green-600"
					/>

					{/* Quick Actions Card (spans 2 rows on the right) */}
					<QuickActions />

					{/* Row 2 Stats Cards */}
					<StatsCard
						title="Total Transactions"
						value={stats?.total_transactions?.toString() || "0"}
						subtitle="All transactions"
						icon={CheckCircle}
						iconBgColor="bg-purple-50"
						iconColor="text-purple-600"
					/>

					<StatsCard
						title="Total Lessons"
						value={stats?.total_lessons?.toString() || "0"}
						subtitle="Available lessons"
						icon={UserCheck}
						iconBgColor="bg-orange-50"
						iconColor="text-orange-600"
					/>
				</div>

				{/* Search Section */}
				<SearchSection />

				{/* Latest Courses and Top Mentors Row */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					<LatestTransactions transactions={latestTransactions} />
					<LatestUsers users={latestUsers} />
				</div>
			</main>
		</Layout>
	);
}
