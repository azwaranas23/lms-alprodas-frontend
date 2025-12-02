import { useEffect, useRef } from "react";
import {
	Users,
	CheckCircle,
	DollarSign,
	Star,
	TrendingUp,
	BookOpen,
	List,
	PlayCircle,
	Settings,
} from "lucide-react";
import { env } from "~/config/env";

interface Course {
	id: number;
	title: string;
	description: string;
	about?: string;
	tools?: string;
	price: number;
	status: string;
	total_lessons: number;
	total_students: number;
	created_at: string;
	updated_at: string;
	subject?: {
		id: number;
		name: string;
		topic?: {
			id: number;
			name: string;
		};
	};
	mentor?: {
		id: number;
		name: string;
		email: string;
		profile?: {
			bio?: string;
			avatar?: string;
			expertise?: string;
		};
	};
	images?: Array<{
		id: number;
		image_path: string;
		order_index: number;
	}>;
	key_points?: Array<{
		id: number;
		key_point: string;
	}>;
	personas?: Array<{
		id: number;
		persona: string;
	}>;
	reviews?: Array<any>;
	sections?: Array<{
		id: number;
		title: string;
		description: string;
		order_index: number;
		total_lessons: number;
		lessons: Array<{
			id: number;
			title: string;
			content_type: string;
			content_url: string;
			content_text?: string;
			duration_minutes: number;
			order_index: number;
			is_active: boolean;
		}>;
	}>;
}

interface OverviewTabProps {
	course: Course;
}

function formatCurrency(amount: number): string {
	if (amount >= 1000000000) {
		return `Rp ${(amount / 1000000000).toFixed(1).replace(/\.0$/, "")}B`;
	}
	if (amount >= 1000000) {
		return `Rp ${(amount / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
	}
	if (amount >= 1000) {
		return `Rp ${(amount / 1000).toFixed(1).replace(/\.0$/, "")}K`;
	}
	return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatDuration(totalMinutes: number): string {
	if (totalMinutes === 0) return "0 min";

	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	if (hours === 0) {
		return `${minutes} min`;
	} else if (minutes === 0) {
		return `${hours} hour${hours > 1 ? 's' : ''}`;
	} else {
		return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
	}
}

function calculateTotalDuration(course: Course): number {
	if (!course.sections || !Array.isArray(course.sections)) {
		return 0;
	}

	return course.sections.reduce((total: number, section: any) => {
		if (!section.lessons || !Array.isArray(section.lessons)) {
			return total;
		}
		return total + section.lessons.reduce((sectionTotal: number, lesson: any) => {
			return sectionTotal + (lesson.duration_minutes || 0);
		}, 0);
	}, 0);
}

export function OverviewTab({ course }: OverviewTabProps) {
	const enrollmentChartRef = useRef<HTMLCanvasElement>(null);
	const progressChartRef = useRef<HTMLCanvasElement>(null);
	const enrollmentChartInstance = useRef<any>(null);
	const progressChartInstance = useRef<any>(null);

	// Calculate average rating from reviews
	const averageRating = course.reviews && course.reviews.length > 0
		? (course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length).toFixed(1)
		: "0.0";

	const totalReviews = course.reviews?.length || 0;

	// Calculate total revenue (price * total students)
	const totalRevenue = course.price * course.total_students;

	// Initialize charts when component mounts
	useEffect(() => {
		if (typeof window === "undefined") return;

		// Dynamically import Chart.js to avoid SSR issues
		import("chart.js/auto")
			.then((ChartJS) => {
				const Chart = ChartJS.default;

				// Student Enrollment Chart Data (Past 6 months) - EXACT from HTML template
				const enrollmentData = {
					labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
					datasets: [
						{
							label: "New Enrollments",
							data: [125, 180, 220, 195, 280, 350],
							borderColor: "#0C51D9",
							backgroundColor: "rgba(12, 81, 217, 0.1)",
							borderWidth: 3,
							fill: true,
							tension: 0.4,
							pointBackgroundColor: "#0C51D9",
							pointBorderColor: "#ffffff",
							pointBorderWidth: 2,
							pointRadius: 8,
							pointHoverRadius: 10,
						},
					],
				};

				// Lesson Progress Chart Data - EXACT from HTML template
				const progressData = {
					labels: [
						"Lesson 1-4",
						"Lesson 5-8",
						"Lesson 9-12",
						"Lesson 13-16",
						"Lesson 17-20",
						"Lesson 21-24",
					],
					datasets: [
						{
							label: "Completion Rate",
							data: [95, 88, 82, 75, 68, 45],
							borderColor: "#10B981",
							backgroundColor: "rgba(16, 185, 129, 0.1)",
							borderWidth: 3,
							fill: true,
							tension: 0.4,
							pointBackgroundColor: "#10B981",
							pointBorderColor: "#ffffff",
							pointBorderWidth: 2,
							pointRadius: 8,
							pointHoverRadius: 10,
						},
					],
				};

				// Chart options (exactly from HTML template)
				const enrollmentOptions = {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							backgroundColor: "rgba(0, 0, 0, 0.8)",
							titleColor: "#ffffff",
							bodyColor: "#ffffff",
							borderColor: "#0C51D9",
							borderWidth: 1,
							cornerRadius: 8,
							displayColors: false,
							callbacks: {
								title: function (context: any) {
									return context[0].label;
								},
								label: function (context: any) {
									return `${context.parsed.y} new enrollments`;
								},
							},
						},
					},
					scales: {
						x: {
							grid: {
								display: false,
							},
							border: {
								display: false,
							},
							ticks: {
								color: "#6B7280",
								font: {
									size: 11,
								},
							},
						},
						y: {
							beginAtZero: true,
							max: 400,
							grid: {
								color: "rgba(0, 0, 0, 0.05)",
								drawBorder: false,
							},
							border: {
								display: false,
							},
							ticks: {
								color: "#6B7280",
								font: {
									size: 11,
								},
							},
						},
					},
					interaction: {
						intersect: false,
						mode: "index" as const,
					},
				};

				const progressOptions = {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							backgroundColor: "rgba(0, 0, 0, 0.8)",
							titleColor: "#ffffff",
							bodyColor: "#ffffff",
							borderColor: "#10B981",
							borderWidth: 1,
							cornerRadius: 8,
							displayColors: false,
							callbacks: {
								title: function (context: any) {
									return context[0].label;
								},
								label: function (context: any) {
									return `${context.parsed.y}% completion rate`;
								},
							},
						},
					},
					scales: {
						x: {
							grid: {
								display: false,
							},
							border: {
								display: false,
							},
							ticks: {
								color: "#6B7280",
								font: {
									size: 11,
								},
							},
						},
						y: {
							beginAtZero: true,
							max: 100,
							grid: {
								color: "rgba(0, 0, 0, 0.05)",
								drawBorder: false,
							},
							border: {
								display: false,
							},
							ticks: {
								color: "#6B7280",
								font: {
									size: 11,
								},
								stepSize: 20,
								callback: function (value: any) {
									return value + "%";
								},
							},
						},
					},
					interaction: {
						intersect: false,
						mode: "index" as const,
					},
				};

				// Cleanup existing charts
				if (enrollmentChartInstance.current) {
					enrollmentChartInstance.current.destroy();
				}
				if (progressChartInstance.current) {
					progressChartInstance.current.destroy();
				}

				// Initialize Enrollment Chart
				if (enrollmentChartRef.current) {
					const ctx = enrollmentChartRef.current.getContext("2d");
					if (ctx) {
						enrollmentChartInstance.current = new Chart(ctx, {
							type: "line",
							data: enrollmentData,
							options: enrollmentOptions,
						});
					}
				}

				// Initialize Progress Chart
				if (progressChartRef.current) {
					const ctx = progressChartRef.current.getContext("2d");
					if (ctx) {
						progressChartInstance.current = new Chart(ctx, {
							type: "line",
							data: progressData,
							options: progressOptions,
						});
					}
				}
			})
			.catch((error) => {
				console.error("Failed to load Chart.js:", error);
			});

		// Cleanup on unmount
		return () => {
			if (enrollmentChartInstance.current) {
				enrollmentChartInstance.current.destroy();
			}
			if (progressChartInstance.current) {
				progressChartInstance.current.destroy();
			}
		};
	}, []);

	return (
		<div>
			{/* Course Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-brand-dark text-base font-medium">
								Students Enrolled
							</p>
							<p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
								{course.total_students}
							</p>
							<p className="text-success text-base font-medium">
								+12% this month
							</p>
						</div>
						<div className="w-12 h-12 bg-blue-50 rounded-[16px] flex items-center justify-center">
							<Users className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>
				<div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-brand-dark text-base font-medium">
								Completion Rate
							</p>
							<p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
								87%
							</p>
							<p className="text-success text-base font-medium">
								Above average
							</p>
						</div>
						<div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>
				<div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-brand-dark text-base font-medium">
								Total Revenue
							</p>
							<p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
								{formatCurrency(totalRevenue)}
							</p>
							<p className="text-success text-base font-medium">
								This course
							</p>
						</div>
						<div className="w-12 h-12 bg-purple-50 rounded-[16px] flex items-center justify-center">
							<DollarSign className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>
				<div className="bg-white border border-[#DCDEDD] rounded-[20px] hover:border-[#0C51D9] hover:border-2 transition-all duration-300 p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-brand-dark text-base font-medium">
								Average Rating
							</p>
							<p className="text-brand-dark text-3xl font-extrabold leading-tight my-2">
								{averageRating}
							</p>
							<p className="text-success text-base font-medium">
								{totalReviews} reviews
							</p>
						</div>
						<div className="w-12 h-12 bg-orange-50 rounded-[16px] flex items-center justify-center">
							<Star className="w-6 h-6 text-orange-600" />
						</div>
					</div>
				</div>
			</div>

			{/* Course Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Student Enrollment Chart */}
				<div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
							<TrendingUp className="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<h3 className="text-brand-dark text-lg font-bold">
								Student Enrollment
							</h3>
							<p className="text-brand-light text-sm">
								Monthly enrollment trends
							</p>
						</div>
					</div>

					{/* Chart Container */}
					<div className="relative">
						<canvas
							ref={enrollmentChartRef}
							className="w-full"
							style={{ maxHeight: "250px" }}
						></canvas>
					</div>
				</div>

				{/* Lesson Progress Chart */}
				<div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
							<BookOpen className="w-6 h-6 text-green-600" />
						</div>
						<div>
							<h3 className="text-brand-dark text-lg font-bold">
								Lesson Completion
							</h3>
							<p className="text-brand-light text-sm">
								Student progress through course lessons
							</p>
						</div>
					</div>

					{/* Chart Container */}
					<div className="relative">
						<canvas
							ref={progressChartRef}
							className="w-full"
							style={{ maxHeight: "250px" }}
						></canvas>
					</div>
				</div>
			</div>

			{/* Course Information Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				{/* Course Content */}
				<div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
					{/* Header Section */}
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
							<List className="w-6 h-6 text-purple-600" />
						</div>
						<div>
							<h3 className="text-brand-dark text-lg font-bold">
								Course Content
							</h3>
							<p className="text-brand-light text-sm">
								Lessons and materials overview
							</p>
						</div>
					</div>

					{/* Content List */}
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Total Lessons
							</span>
							<span className="text-brand-dark text-base font-medium">
								{course.total_lessons} lessons
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Video Duration
							</span>
							<span className="text-brand-dark text-base font-medium">
								{formatDuration(calculateTotalDuration(course))}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Assignments
							</span>
							<span className="text-brand-dark text-base font-medium">
								8 assignments
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Downloadable Resources
							</span>
							<span className="text-brand-dark text-base font-medium">
								15 files
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Certificate
							</span>
							<span className="text-brand-dark text-base font-medium">
								Included
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Live Sessions
							</span>
							<span className="text-brand-dark text-base font-medium">
								6 sessions
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Community Access
							</span>
							<span className="text-brand-dark text-base font-medium">
								Discord + Forum
							</span>
						</div>
					</div>

					{/* Preview Button */}
					<div className="mt-4 pt-4 border-t border-[#DCDEDD]">
						<button className="w-full border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-3 py-2 flex items-center justify-center gap-2">
							<PlayCircle className="w-5 h-5 text-brand-light" />
							<span className="text-brand-dark text-base font-semibold">
								Preview Course
							</span>
						</button>
					</div>
				</div>

				{/* Course Settings */}
				<div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 bg-orange-50 rounded-[12px] flex items-center justify-center">
							<Settings className="w-6 h-6 text-orange-600" />
						</div>
						<div>
							<h3 className="text-brand-dark text-lg font-bold">
								Course Settings
							</h3>
							<p className="text-brand-light text-sm">
								Configuration and pricing
							</p>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Category
							</span>
							<span className="text-brand-dark text-base font-medium">
								{course.subject?.name || "Web Development"}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Price
							</span>
							<span className="text-brand-dark text-base font-medium">
								{formatCurrency(course.price)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Level
							</span>
							<span className="text-brand-dark text-base font-medium">
								Advanced
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Language
							</span>
							<span className="text-brand-dark text-base font-medium">
								English
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span className="text-brand-light text-base">
								Access
							</span>
							<span className="text-brand-dark text-base font-medium">
								Lifetime
							</span>
						</div>
					</div>

					{/* Course Thumbnail */}
					<div className="mt-4">
						<img
							src={
								course.images?.[1]?.image_path
									? `${env.BASE_URL}/${course.images[1].image_path}`
									: "https://images.unsplash.com/photo-1633356122544-f134324a6cee"
							}
							alt="Course Preview"
							className="w-full h-[138px] object-cover rounded-[12px]"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
