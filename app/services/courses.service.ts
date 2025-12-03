import { apiClient } from "~/lib/axios";
import type {
  CoursesByTopicResponse,
  MostJoinedCoursesResponse,
  Course,
} from "../types/courses";
import {
  courseResponseSchema,
  coursesResponseSchema,
  genericSuccessResponseSchema,
} from "~/schemas/api-responses";
import { logger } from "~/utils/logger";

export type { Course } from "../types/courses";

export interface CompleteCourseResponse {
  data: {
    success: boolean;
    certificate_id?: string;
  };
}

export interface CourseProgress {
  course_id: number;
  completed_lessons: number;
  total_lessons: number;
  completion_percentage: number;
  progress_percentage: number;
  started_at: string;
  last_accessed_lesson_id?: number;
  current_lesson?: {
    id: number;
    title: string;
    section_name: string;
  };
  sections?: Array<{
    id: number;
    name: string;
    lessons: Array<{
      id: number;
      title: string;
      is_completed: boolean;
      order: number;
    }>;
  }>;
}

export interface LessonDetail {
  id: number;
  title: string;
  description?: string;
  content: string;
  duration: number;
  duration_minutes: number;
  video_url?: string;
  type: "VIDEO" | "ARTICLE";
  is_completed: boolean;
  order: number;
  section: {
    id: number;
    name: string;
  };
}

export interface CourseEnrollmentDetail {
  enrollment_id: number;
  course: {
    id: number;
    title: string;
    certificate_template?: string;
    subject?: {
      id: number;
      name: string;
    };
    images?: {
      main?: string;
      preview?: string;
    };
    mentor?: {
      id: number;
      name: string;
      profile_picture?: string;
    };
    total_lessons: number;
    sections?: Array<{
      id: number;
      name: string;
      lessons: Array<{
        id: number;
        title: string;
      }>;
    }>;
  };
  progress: CourseProgress;
  completed_at?: string;
  certificate?: {
    id: string;
    download_url: string;
  };
  certificate_id?: string;
}

export interface CoursesListParams {
  page?: number;
  limit?: number;
  search?: string;
  topicId?: number;
  subjectId?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface CoursesListResponse {
  message: string;
  data: {
    items: Course[];
    meta: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
    };
  };
}

export interface CourseDetailResponse {
  message: string;
  data: Course;
}

export interface CreateCourseData {
  title: string;
  description: string;
  about?: string;
  tools?: string;
  key_points?: string[];
  personas?: string[];
  status?: "PUBLISHED" | "DRAFT";
  subject_id: number;
  mentor_id: number;
  course_token: string;
  images?: File[];
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  about?: string;
  tools?: string;
  key_points?: string[];
  personas?: string[];
  price?: number;
  status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  subject_id?: number;
  mentor_id?: number;
  course_token?: string;
  // Images are handled via separate endpoints, no longer included here
}

export const coursesService = {
  // Get most joined courses for homepage
  async getMostJoinedCourses(): Promise<MostJoinedCoursesResponse> {
    const response = await apiClient.get("/front/courses/most-joined");
    return response.data;
  },

  // Get courses by topic ID for topic page
  async getCoursesByTopic(
    topicId: number,
    params?: { page?: number; limit?: number }
  ): Promise<CoursesByTopicResponse> {
    const response = await apiClient.get(`/front/courses/by-topic/${topicId}`, {
      params,
    });
    return response.data;
  },

  // Get all courses with pagination and filters
  async getCourses(params?: CoursesListParams): Promise<CoursesListResponse> {
    const response = await apiClient.get("/courses", { params });
    const validatedResponse = coursesResponseSchema.safeParse(response.data);
    if (!validatedResponse.success) {
      logger.warn("API response validation failed for getCourses", {
        action: "getCourses",
        metadata: { error: validatedResponse.error },
      });
    }
    return response.data;
  },

  // Get course by ID (admin/dashboard)
  async getCourseById(id: number): Promise<CourseDetailResponse> {
    const response = await apiClient.get(`/courses/${id}`);
    const validatedResponse = courseResponseSchema.safeParse(response.data);
    if (!validatedResponse.success) {
      logger.warn("API response validation failed for getCourseById", {
        action: "getCourseById",
        metadata: { error: validatedResponse.error },
      });
    }
    return response.data;
  },

  // Get course detail for front page
  async getCourseDetail(id: number): Promise<CourseDetailResponse> {
    const response = await apiClient.get(`/front/courses/detail/${id}`);
    const validatedResponse = courseResponseSchema.safeParse(response.data);
    if (!validatedResponse.success) {
      logger.warn("API response validation failed for getCourseDetail", {
        action: "getCourseDetail",
        metadata: { error: validatedResponse.error },
      });
    }
    return response.data;
  },

  // Create new course
  async createCourse(data: CreateCourseData): Promise<CourseDetailResponse> {
    const formData = new FormData();

    // Append all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "images" && Array.isArray(value)) {
          // Handle images array - append each with same key name "images" (not images[])
          value.forEach((file: File) => {
            formData.append("images", file);
          });
        } else if (Array.isArray(value)) {
          // Handle other arrays (key_points, personas)
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (value instanceof File) {
          // Handle single File objects
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.post("/courses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update course
  async updateCourse(
    id: number,
    data: UpdateCourseData
  ): Promise<CourseDetailResponse> {
    const formData = new FormData();

    // Append all fields to FormData (images handled separately via individual endpoints)
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          // Handle arrays (key_points, personas)
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (value instanceof File) {
          // Handle single File objects
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.patch(`/courses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update individual course image
  async updateCourseImage(
    courseId: number,
    imageType: "main" | "preview" | "sample" | "certificate",
    imageFile: File
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await apiClient.patch(
      `/courses/${courseId}/image/${imageType}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  // Delete course
  async deleteCourse(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  },

  // Get student's enrolled courses with proper types
  async getMyEnrolledCourses(params?: {
    page?: number;
    limit?: number;
  }): Promise<CoursesListResponse> {
    const { page = 1, limit = 10 } = params || {};
    const response = await apiClient.get("/courses/student/my-courses", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get course learning structure with lessons and progress
  async getCourseLearning(
    courseId: number
  ): Promise<{ message: string; data: CourseProgress }> {
    const response = await apiClient.get(`/courses/${courseId}/learn`);
    return response.data;
  },

  // Get course progress
  async getCourseProgress(
    courseId: number
  ): Promise<{ message: string; data: CourseProgress }> {
    const response = await apiClient.get(`/courses/${courseId}/progress`);
    return response.data;
  },

  // Get lesson detail
  async getLessonDetail(
    lessonId: number
  ): Promise<{ message: string; data: LessonDetail }> {
    const response = await apiClient.get(`/courses/lessons/${lessonId}`);
    return response.data;
  },

  // Mark lesson as complete
  async completeLesson(lessonId: number): Promise<{
    message: string;
    data: { progress: CourseProgress; next_lesson?: LessonDetail };
  }> {
    const response = await apiClient.get(
      `/courses/lessons/${lessonId}/complete`
    );
    return response.data;
  },

  // Complete course
  async completeCourse(courseId: number): Promise<CompleteCourseResponse> {
    const response = await apiClient.post(`/courses/${courseId}/complete`);
    return response.data;
  },

  // Get course enrollment details (for completion page)
  async getCourseEnrollment(
    courseId: number
  ): Promise<{ message: string; data: CourseEnrollmentDetail }> {
    const response = await apiClient.get(`/courses/${courseId}/enrollment`);
    return response.data;
  },

  // Download certificate PDF
  async downloadCertificate(certificateId: string): Promise<Blob> {
    const response = await apiClient.get(
      `/certificates/${certificateId}/download`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};
