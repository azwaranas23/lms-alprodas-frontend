import { apiClient } from '~/lib/axios';

export interface Lesson {
  id: number;
  section_id: number;
  title: string;
  content_type: 'VIDEO' | 'ARTICLE' | 'QUIZ';
  content_url?: string;
  content_text?: string;
  duration_minutes: number;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLessonRequest {
  title: string;
  description?: string;
  section_id: number;
  content_type: 'VIDEO' | 'ARTICLE' | 'QUIZ';
  content_url?: string;
  content_text?: string;
  duration_minutes?: number;
  order_index: number;
}

export interface UpdateLessonRequest {
  title?: string;
  description?: string;
  content_type?: 'VIDEO' | 'ARTICLE' | 'QUIZ';
  content_url?: string;
  content_text?: string;
  duration_minutes?: number;
  order_index?: number;
}

export const lessonsService = {
  // Get all lessons
  getAllLessons: async () => {
    const response = await apiClient.get('/lessons');
    return response.data;
  },

  // Get lessons by section ID
  getLessonsBySection: async (sectionId: number) => {
    const response = await apiClient.get(`/lessons/section/${sectionId}`);
    return response.data;
  },

  // Get lessons by course ID
  getLessonsByCourse: async (courseId: number) => {
    const response = await apiClient.get(`/lessons/course/${courseId}`);
    return response.data;
  },

  // Get lesson by ID
  getLessonById: async (id: number) => {
    const response = await apiClient.get(`/lessons/${id}`);
    return response.data;
  },

  // Create new lesson
  createLesson: async (data: CreateLessonRequest) => {
    const response = await apiClient.post('/lessons', data);
    return response.data;
  },

  // Update lesson
  updateLesson: async (id: number, data: UpdateLessonRequest) => {
    const response = await apiClient.patch(`/lessons/${id}`, data);
    return response.data;
  },

  // Delete lesson
  deleteLesson: async (id: number) => {
    const response = await apiClient.delete(`/lessons/${id}`);
    return response.data;
  },
};