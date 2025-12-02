/**
 * Type definitions for course learning and video playback
 */

export interface CourseLesson {
	id: number;
	section_id: number;
	title: string;
	description?: string;
	video_url?: string;
	content?: string;
	duration_minutes: number;
	order: number;
	is_completed?: boolean;
	completed_at?: string;
	resources?: LessonResource[];
	quiz?: LessonQuiz;
}

export interface LessonResource {
	id: number;
	title: string;
	type: 'PDF' | 'CODE' | 'LINK' | 'FILE';
	url: string;
	size?: number;
}

export interface QuizQuestion {
	id: number;
	question: string;
	options: string[];
	correct_answer: number;
}

export interface LessonQuiz {
	id: number;
	questions: QuizQuestion[];
	passing_score: number;
	attempts_allowed: number;
}


export interface CourseSection {
	id: number;
	course_id: number;
	title: string;
	description?: string;
	order: number;
	lessons: CourseLesson[];
	total_duration: number;
	completed_lessons?: number;
	total_lessons?: number;
}

export interface CourseMentor {
	id: number;
	name: string;
	email: string;
	profile?: {
		avatar?: string;
		bio?: string;
		expertise?: string;
		total_courses?: number;
		total_students?: number;
	};
}

export interface CourseImage {
	id: number;
	type: 'main' | 'preview' | 'sample' | 'certificate';
	image_path: string;
}

export interface CourseLearningData {
	id: number;
	title: string;
	description: string;
	about?: string;
	tools?: string;
	key_points?: string[];
	personas?: string[];
	price: number;
	status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
	total_lessons: number;
	total_duration: number;
	total_students: number;
	sections: CourseSection[];
	mentor?: CourseMentor;
	images?: CourseImage[];
	is_enrolled: boolean;
	enrolled_at?: string;
}


export interface CourseProgress {
	course_id: number;
	total_lessons: number;
	completed_lessons: number;
	progress_percentage: number;
	last_accessed_lesson_id?: number;
	estimated_completion_time?: number;
	started_at: string;
	last_accessed_at?: string;
	completed_at?: string;
	certificate_id?: string;
}

export interface LessonDetail {
	id: number;
	title: string;
	description: string;
	video_url?: string;
	content?: string;
	duration_minutes: number;
	order: number;
	section: {
		id: number;
		title: string;
		order: number;
	};
	resources?: LessonResource[];
	quiz?: LessonQuiz;
	next_lesson?: {
		id: number;
		title: string;
		section_id: number;
	};
	previous_lesson?: {
		id: number;
		title: string;
		section_id: number;
	};
	is_completed: boolean;
	completed_at?: string;
	notes?: string;
	bookmarked?: boolean;
}

