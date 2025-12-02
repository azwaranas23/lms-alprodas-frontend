// This file now only contains TypeScript types
// Zod schemas have been moved to /app/schemas/courses.ts

// Course wizard step data types
export interface CourseWizardData {
	courseInfo?: {
		name: string;
		description: string;
		subject: string;
	};
	courseDetails?: {
		keyPoint1: string;
		keyPoint2?: string;
		keyPoint3?: string;
		keyPoint4?: string;
		targetAudience1: string;
		targetAudience2?: string;
		targetAudience3?: string;
		targetAudience4?: string;
		tools?: string;
		level?: string;
		duration?: string;
		requirements?: string[];
	};
	coursePrice?: {
		price: number;
		availability: 'published' | 'draft';
	};
}

// Flattened version for form handling
export interface CourseWizardFormData {
	name: string;
	description: string;
	subject: string;
	keyPoint1: string;
	keyPoint2?: string;
	keyPoint3?: string;
	keyPoint4?: string;
	targetAudience1: string;
	targetAudience2?: string;
	targetAudience3?: string;
	targetAudience4?: string;
	tools?: string;
	price: number;
	availability: 'published' | 'draft';
	mainPhoto?: File;
	previewPhoto?: File;
	contentPhoto?: File;
	certificatePhoto?: File;
}

export interface CourseWizardStep {
	id: string;
	title: string;
	description: string;
	isCompleted?: boolean;
	isActive?: boolean;
}