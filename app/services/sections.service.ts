import { apiClient } from '~/lib/axios';
import { API_ENDPOINTS } from '~/constants/api';
import type { CreateSectionFormData, UpdateSectionFormData } from '~/schemas/sections';

// API response types
export interface Section {
  id: number;
  title: string;
  description: string;
  order_index: number;
  course_id: number;
  created_at: string;
  updated_at: string;
  total_lessons?: number;
}

// Export the Zod form types for use in other files
export type CreateSectionRequest = CreateSectionFormData;
export type UpdateSectionRequest = UpdateSectionFormData;

export interface SectionResponse {
  message: string;
  data: Section;
}

export interface SectionsListResponse {
  message: string;
  data: Section[];
}

export const sectionsService = {
  // Get all sections for a course
  getSectionsByCourse: async (courseId: number): Promise<SectionsListResponse> => {
    const response = await apiClient.get(`${API_ENDPOINTS.sections}/course/${courseId}`);
    return response.data;
  },

  // Create new section
  createSection: async (data: CreateSectionRequest): Promise<SectionResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.sections, data);
    return response.data;
  },

  // Get section by ID
  getSectionById: async (id: number): Promise<SectionResponse> => {
    const response = await apiClient.get(`${API_ENDPOINTS.sections}/${id}`);
    return response.data;
  },

  // Update section
  updateSection: async (id: number, data: UpdateSectionRequest): Promise<SectionResponse> => {
    const response = await apiClient.patch(`${API_ENDPOINTS.sections}/${id}`, data);
    return response.data;
  },

  // Delete section
  deleteSection: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`${API_ENDPOINTS.sections}/${id}`);
    return response.data;
  },
};