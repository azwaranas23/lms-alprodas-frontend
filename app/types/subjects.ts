export interface SubjectTopic {
	id: number;
	name: string;
	description?: string | null;
	image?: string | null;
}

export interface Subject {
	id: number;
	name: string;
	description?: string | null;
	image?: string | null;
	topic_id: number;
	topic: SubjectTopic;
	total_courses: number;
	total_students: number;
}

export interface SubjectsByTopicResponse {
	message: string;
	data: {
		items: Subject[];
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