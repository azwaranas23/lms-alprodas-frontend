import { useState, useEffect } from "react";
import { dashboardService } from "~/services/dashboard.service";

interface DashboardStats {
	total_revenue: number;
	total_transactions: number;
	total_students: number;
	total_courses: number;
	total_lessons: number;
	total_withdrawals: number;
}

interface LatestUser {
	id: number;
	name: string;
	email: string;
	created_at: string;
	avatar: string | null;
	role: {
		id: number;
		name: string;
		key: string;
	};
}

interface LatestTransaction {
	id: number;
	order_id: string;
	amount: number;
	status: string;
	payment_method: string;
	transaction_date: string;
	course: {
		id: number;
		title: string;
		image?: string;
	};
	student: {
		id: number;
		name: string;
		email: string;
	};
}

export function useDashboard() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [latestUsers, setLatestUsers] = useState<LatestUser[]>([]);
	const [latestTransactions, setLatestTransactions] = useState<
		LatestTransaction[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				setLoading(true);
				setError(null);

				const [statsData, usersData, transactionsData] =
					await Promise.all([
						dashboardService.getStats(),
						dashboardService.getLatestUsers(),
						dashboardService.getLatestTransactions(),
					]);

				setStats(statsData);
				setLatestUsers(usersData);
				setLatestTransactions(transactionsData);
			} catch (err) {
				console.error("Error fetching dashboard data:", err);
				setError("Failed to fetch dashboard data");
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	return {
		stats,
		latestUsers,
		latestTransactions,
		loading,
		error,
	};
}
