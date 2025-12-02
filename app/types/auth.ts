export interface Permission {
	id: number;
	name: string;
	key: string;
	resource: string;
}

export interface UserRole {
	id: number;
	name: string;
	key: "manager" | "mentor" | "student";
	permissions?: Permission[];
	created_at?: string;
	updated_at?: string;
}

export interface UserProfile {
	id: number;
	bio?: string;
	avatar?: string;
	gender?: string;
	expertise?: string;
	experience_years?: number;
	linkedin_url?: string;
	github_url?: string;
}

export interface User {
	id: number;
	email: string;
	name: string;
	phone?: string | null;
	is_verified?: boolean;
	is_active?: boolean;
	role_id?: number;
	role?: UserRole;
	avatar?: string;
	email_verified_at?: string;
	created_at?: string;
	updated_at?: string;
	role_name?: string;
	user_profile?: UserProfile;
	total_courses?: number | null;
	total_students?: number | null;
	total_enrolled_courses?: number | null;
	enrolled_courses_count?: number | null;
	created_courses_count?: number | null;
	total_revenue?: number | null;
}

export interface LoginResponse {
	message: string;
	data: {
		access_token: string;
		user: User;
	};
}

export interface AuthError {
	message: string;
	error?: string;
	statusCode?: number;
}