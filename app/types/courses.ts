export interface CourseImage {
  id: number;
  image_path: string;
  order_index: number;
}

export interface CourseKeyPoint {
  id: number;
  key_point: string;
}

export interface CoursePersona {
  id: number;
  persona: string;
}

export interface CourseResource {
  id: number;
  // Add other resource properties if needed
}

export interface CourseLesson {
  id: number;
  title: string;
  content_type: "VIDEO" | "ARTICLE";
  content_url: string | null;
  content_text: string | null;
  duration_minutes: number;
  order_index: number;
  is_active: boolean;
}

export interface CourseSection {
  id: number;
  title: string;
  description: string | null;
  order_index: number;
  total_lessons: number;
  lessons: CourseLesson[];
}

export interface CourseReviewStudent {
  id: number;
  name: string;
  profile: {
    avatar: string;
  };
}

export interface CourseReview {
  id: number;
  rating: number;
  review_text: string;
  created_at: string;
  student: CourseReviewStudent;
}

export interface CourseMentorProfile {
  bio: string;
  avatar: string;
  expertise: string;
}

export interface CourseMentor {
  id: number;
  email: string;
  name: string;
  profile: CourseMentorProfile;
}

export interface CourseTopic {
  id: number;
  name: string;
}

export interface CourseSubject {
  id: number;
  name: string;
  topic: CourseTopic;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  about?: string;
  tools?: string;
  price: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  total_lessons: number;
  total_students: number;
  created_at: string;
  updated_at: string;
  subject?: CourseSubject;
  mentor?: CourseMentor;
  images?: CourseImage[];
  key_points?: CourseKeyPoint[];
  personas?: CoursePersona[];
  resources?: CourseResource[];
  sections?: CourseSection[];
  reviews?: CourseReview[];
  is_enrolled?: boolean;
  is_most_joined?: boolean;
  course_token?: string;
}

export interface MostJoinedCoursesResponse {
  message: string;
  data: Course[];
}

export interface CoursesByTopicResponse {
  message: string;
  data: {
    items: Course[];
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
