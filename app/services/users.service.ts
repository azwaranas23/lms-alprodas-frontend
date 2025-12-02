import { apiClient } from "~/lib/axios";
import type { User } from "~/types/auth";

export interface UsersListParams {
	page?: number;
	limit?: number;
	search?: string;
	sort?: string;
	order?: "asc" | "desc";
}

export interface UsersListResponse {
	message: string;
	data: {
		items: User[];
		meta: {
			total: number;
			page: number;
			per_page: number;
			total_pages: number;
		};
	};
}

export interface UserDetailResponse {
	message: string;
	data: User;
}

export const usersService = {
	async getUsers(role: "mentors" | "students", params?: UsersListParams): Promise<UsersListResponse> {
		const response = await apiClient.get(`/users/${role}`, { params });
		return response.data;
	},

	async getUserById(id: number): Promise<UserDetailResponse> {
		const response = await apiClient.get(`/users/${id}`);
		return response.data;
	},

	async updateUser(
		id: number,
		data: Partial<User>
	): Promise<UserDetailResponse> {
		const response = await apiClient.patch(`/users/${id}`, data);
		return response.data;
	},

	async deleteUser(id: number): Promise<{ message: string }> {
		const response = await apiClient.delete(`/users/${id}`);
		return response.data;
	},

	async toggleUserStatus(id: number): Promise<UserDetailResponse> {
		const response = await apiClient.patch(`/users/${id}/toggle-status`);
		return response.data;
	},
};
