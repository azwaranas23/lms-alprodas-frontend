import { env } from "~/config/env";

// Use environment variable from config
export const API_BASE_URL = env.API_URL;
export const BASE_URL = env.BASE_URL;

export const API_ENDPOINTS = {
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		verifyEmail: "/auth/verify-email",
		resendVerification: "/auth/resend-verification",
	},
	dashboard: {
		stats: "/dashboard/statistics",
		transactions: "/dashboard/latest-transactions",
		users: "/dashboard/latest-users",
		courses: "/dashboard/latest-courses",
	},
	topics: "/topics",
	courses: "/courses",
	subjects: "/subjects",
	sections: "/sections",
	lessons: "/lessons",
	mentors: "/api/mentors",
	students: "/api/students",
	transactions: {
		all: "/transactions",
		mentor: {
			list: "/transactions/mentor/list",
		},
		student: {
			list: "/transactions/student/list",
		},
	},
	wallets: "/api/wallets",
	withdrawals: {
		myWithdrawals: "/withdrawals/my-withdrawals",
		all: "/withdrawals/all",
		balance: "/withdrawals/balance",
		validatePassword: "/withdrawals/validate-password",
		checkBalance: "/withdrawals/check-balance",
		create: "/withdrawals",
		byId: (id: number) => `/withdrawals/${id}`,
		updateStatus: (id: number) => `/withdrawals/${id}/status`,
	},
} as const;

export const QUERY_KEYS = {
	dashboard: {
		stats: ["dashboard", "stats"],
		transactions: ["dashboard", "transactions"],
		users: ["dashboard", "users"],
		courses: ["dashboard", "courses"],
	},
	topics: ["topics"],
	courses: ["courses"],
	subjects: ["subjects"],
	sections: ["sections"],
	lessons: ["lessons"],
	mentors: ["mentors"],
	students: ["students"],
	withdrawals: ["withdrawals"],
	transactions: {
		mentor: ["transactions", "mentor"],
		student: ["transactions", "student"],
	},
} as const;

// Query Key Factories for better organization and type safety
export const courseKeys = {
	all: ['courses'] as const,
	lists: () => [...courseKeys.all, 'list'] as const,
	list: (filters: Record<string, any>) => [...courseKeys.lists(), { filters }] as const,
	details: () => [...courseKeys.all, 'detail'] as const,
	detail: (id: number) => [...courseKeys.details(), id] as const,
	byTopic: (topicId: number) => [...courseKeys.all, 'topic', topicId] as const,
	mostJoined: () => [...courseKeys.all, 'most-joined'] as const,
	byMentor: (mentorId: number) => [...courseKeys.all, 'mentor', mentorId] as const,
} as const;

export const topicKeys = {
	all: ['topics'] as const,
	lists: () => [...topicKeys.all, 'list'] as const,
	list: (filters?: Record<string, any>) => [...topicKeys.lists(), { filters }] as const,
	details: () => [...topicKeys.all, 'detail'] as const,
	detail: (id: number) => [...topicKeys.details(), id] as const,
} as const;

export const subjectKeys = {
	all: ['subjects'] as const,
	lists: () => [...subjectKeys.all, 'list'] as const,
	list: (filters?: Record<string, any>) => [...subjectKeys.lists(), { filters }] as const,
	details: () => [...subjectKeys.all, 'detail'] as const,
	detail: (id: number) => [...subjectKeys.details(), id] as const,
} as const;

export const sectionKeys = {
	all: ['sections'] as const,
	lists: () => [...sectionKeys.all, 'list'] as const,
	list: (filters?: Record<string, any>) => [...sectionKeys.lists(), { filters }] as const,
	byCourse: (courseId: number) => [...sectionKeys.all, 'course', courseId] as const,
	details: () => [...sectionKeys.all, 'detail'] as const,
	detail: (id: number) => [...sectionKeys.details(), id] as const,
} as const;

export const lessonKeys = {
	all: ['lessons'] as const,
	lists: () => [...lessonKeys.all, 'list'] as const,
	list: (filters: Record<string, any>) => [...lessonKeys.lists(), { filters }] as const,
	details: () => [...lessonKeys.all, 'detail'] as const,
	detail: (id: number) => [...lessonKeys.details(), id] as const,
	byCourse: (courseId: number) => [...lessonKeys.all, 'course', courseId] as const,
	bySection: (sectionId: number) => [...lessonKeys.all, 'section', sectionId] as const,
} as const;

export const withdrawalKeys = {
	all: ['withdrawals'] as const,
	lists: () => [...withdrawalKeys.all, 'list'] as const,
	list: (filters: Record<string, any>) => [...withdrawalKeys.lists(), { filters }] as const,
	details: () => [...withdrawalKeys.all, 'detail'] as const,
	detail: (id: number) => [...withdrawalKeys.details(), id] as const,
	byMentor: (mentorId: number) => [...withdrawalKeys.all, 'mentor', mentorId] as const,
	stats: () => [...withdrawalKeys.all, 'stats'] as const,
	myWithdrawals: () => [...withdrawalKeys.all, 'my-withdrawals'] as const,
	balance: () => [...withdrawalKeys.all, 'balance'] as const,
} as const;

export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (filters: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
	details: () => [...userKeys.all, "detail"] as const,
	detail: (id: number) => [...userKeys.details(), id] as const,
	byRole: (role: string) => [...userKeys.all, "role", role] as const,
} as const;

export const authKeys = {
	all: ['auth'] as const,
	user: () => [...authKeys.all, 'user'] as const,
	profile: () => [...authKeys.all, 'profile'] as const,
} as const;

export const transactionKeys = {
	all: ['transactions'] as const,
	lists: () => [...transactionKeys.all, 'list'] as const,
	list: (filters?: Record<string, any>) => [...transactionKeys.lists(), { filters }] as const,
	mentor: {
		all: ['transactions', 'mentor'] as const,
		lists: () => [...transactionKeys.mentor.all, 'list'] as const,
		list: (filters?: Record<string, any>) => [...transactionKeys.mentor.lists(), { filters }] as const,
	},
	student: {
		all: ['transactions', 'student'] as const,
		lists: () => [...transactionKeys.student.all, 'list'] as const,
		list: (filters?: Record<string, any>) => [...transactionKeys.student.lists(), { filters }] as const,
	},
	details: () => [...transactionKeys.all, 'detail'] as const,
	detail: (id: number) => [...transactionKeys.details(), id] as const,
} as const;
