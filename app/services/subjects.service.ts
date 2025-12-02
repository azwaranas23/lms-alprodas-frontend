import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../constants/api";
import type { SubjectsByTopicResponse } from "../types/subjects";

export interface Subject {
	id: number;
	name: string;
	description: string | null;
	image: string | null;
	topic_id: number;
	total_courses: number;
	topic: {
		id: number;
		name: string;
	};
}

export interface SubjectsResponse {
	items: Subject[];
	meta: {
		total: number;
		page: number;
		per_page: number;
		total_pages: number;
	};
}

export interface GetSubjectsParams {
	page?: number;
	limit?: number;
	search?: string;
	topicId?: number;
	sort?: string;
	order?: "asc" | "desc";
}

export const subjectsService = {
	// Get subjects by topic ID for front page
	getSubjectsByTopic: async (topicId: number): Promise<SubjectsByTopicResponse> => {
		const response = await apiClient.get(`/front/subjects/by-topic/${topicId}`);
		return response.data;
	},

	// Get all subjects (paginated)
	getSubjects: async (
		params: GetSubjectsParams = {}
	): Promise<SubjectsResponse> => {
		const searchParams = new URLSearchParams();

		if (params.page) searchParams.append("page", params.page.toString());
		if (params.limit) searchParams.append("limit", params.limit.toString());
		if (params.search) searchParams.append("search", params.search);
		if (params.topicId)
			searchParams.append("topicId", params.topicId.toString());
		if (params.sort) searchParams.append("sort", params.sort);
		if (params.order) searchParams.append("order", params.order);

		const url = `${API_ENDPOINTS.subjects}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
		const response = await apiClient.get(url);
		return response.data.data;
	},

	// Get subject by ID
	getSubjectById: async (id: number): Promise<Subject> => {
		const response = await apiClient.get(`${API_ENDPOINTS.subjects}/${id}`);
		return response.data.data;
	},

	// Create new subject
	createSubject: async (data: FormData): Promise<Subject> => {
		const response = await apiClient.post(API_ENDPOINTS.subjects, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	},

	// Update subject
	updateSubject: async (id: number, data: FormData): Promise<Subject> => {
		const response = await apiClient.patch(
			`${API_ENDPOINTS.subjects}/${id}`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data.data;
	},

	// Delete subject
	deleteSubject: async (id: number): Promise<void> => {
		await apiClient.delete(`${API_ENDPOINTS.subjects}/${id}`);
	},
};
