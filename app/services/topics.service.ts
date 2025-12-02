import { apiClient } from "../lib/axios";
import { API_ENDPOINTS } from "../constants/api";
import type { TopicsResponse, Topic } from "../types/topics";
import {
	topicResponseSchema,
	topicsResponseSchema,
	genericSuccessResponseSchema
} from "~/schemas/api-responses";
import { logger } from "~/utils/logger";

export type { Topic } from "../types/topics";

export interface GetTopicsParams {
	page?: number;
	limit?: number;
	search?: string;
	sort?: string;
	order?: "asc" | "desc";
}

export const topicsService = {
	// Get front topics for homepage
	getFrontTopics: async (): Promise<TopicsResponse> => {
		const response = await apiClient.get("/front/topics");
		const validatedResponse = topicsResponseSchema.safeParse(response.data);
		if (!validatedResponse.success) {
			logger.warn('API response validation failed for getFrontTopics', {
				action: 'getFrontTopics',
				metadata: { error: validatedResponse.error }
			});
		}
		return response.data;
	},

	// Get all topics (paginated)
	getTopics: async (
		params: GetTopicsParams = {}
	): Promise<TopicsResponse> => {
		const searchParams = new URLSearchParams();

		if (params.page) searchParams.append("page", params.page.toString());
		if (params.limit) searchParams.append("limit", params.limit.toString());
		if (params.search) searchParams.append("search", params.search);
		if (params.sort) searchParams.append("sort", params.sort);
		if (params.order) searchParams.append("order", params.order);

		const url = `${API_ENDPOINTS.topics}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
		const response = await apiClient.get(url);
		const validatedResponse = topicsResponseSchema.safeParse(response.data);
		if (!validatedResponse.success) {
			logger.warn('API response validation failed for getTopics', {
				action: 'getTopics',
				metadata: { error: validatedResponse.error }
			});
		}
		return response.data;
	},

	// Get topic by ID
	getTopicById: async (id: number): Promise<Topic> => {
		const response = await apiClient.get(`${API_ENDPOINTS.topics}/${id}`);
		return response.data.data;
	},

	// Create new topic
	createTopic: async (data: FormData): Promise<Topic> => {
		const response = await apiClient.post(API_ENDPOINTS.topics, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data.data;
	},

	// Update topic
	updateTopic: async (id: number, data: FormData): Promise<Topic> => {
		const response = await apiClient.patch(
			`${API_ENDPOINTS.topics}/${id}`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data.data;
	},

	// Delete topic
	deleteTopic: async (id: number): Promise<void> => {
		await apiClient.delete(`${API_ENDPOINTS.topics}/${id}`);
	},
};
