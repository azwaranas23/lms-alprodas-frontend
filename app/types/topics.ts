export interface Topic {
	id: number;
	name: string;
	description?: string | null;
	image?: string | null;
	course_count: number;
	subject_count: number;
	student_enrollment_count: number;
	created_at?: string;
	updated_at?: string;
}

export interface TopicsResponse {
	message: string;
	data: {
		items: Topic[];
		meta: {
			page: number;
			limit: number;
			total: number;
			total_pages: number;
			has_next: boolean;
			has_prev: boolean;
		};
	};
}