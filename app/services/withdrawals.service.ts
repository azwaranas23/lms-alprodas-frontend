import { apiClient } from "~/lib/axios";
import { API_ENDPOINTS } from "~/constants/api";
import axios from "axios";
import { API_BASE_URL } from "~/constants/api";

export interface Withdrawal {
	id: number;
	user_id: number;
	amount: number;
	status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "PROCESSING";
	withdrawal_code: string;
	bank_name: string;
	account_number: string;
	account_holder_name: string;
	processed_by?: number;
	proof_payment_withdrawal?: string | null;
	requested_at: string;
	processed_at?: string;
	created_at: string;
	updated_at: string;
	user: {
		id: number;
		name: string;
		email: string;
		avatar?: string | null;
		expertise?: string | null;
	};
	processed_by_user?: {
		id: number;
		name: string;
		email: string;
		avatar?: string | null;
		expertise?: string | null;
	};
}

export interface WithdrawalDetail extends Withdrawal {
	// All fields from Withdrawal interface are included
}

export interface WithdrawalsListParams {
	page?: number;
	limit?: number;
	status?: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
}

export interface CreateWithdrawalData {
	amount: number;
	bankName: string;
	accountNumber: string;
	accountHolderName: string;
	password: string;
	notes?: string;
}

export interface WithdrawalsListResponse {
	message: string;
	data: {
		items: Withdrawal[];
		meta: {
			total: number;
			page: number;
			per_page: number;
			total_pages: number;
		};
	};
}

export interface WithdrawalDetailResponse {
	message: string;
	data: WithdrawalDetail;
}

export interface WithdrawalBalanceResponse {
	message: string;
	data: {
		total_earnings: number;
		total_withdrawn: number;
		available_balance: number;
		pending_withdrawals: number;
		total_pending_count: number;
		total_success_count: number;
	};
}

export const withdrawalsService = {
	// Get user's withdrawal requests
	async getMyWithdrawals(
		params?: WithdrawalsListParams
	): Promise<WithdrawalsListResponse> {
		const response = await apiClient.get(
			API_ENDPOINTS.withdrawals.myWithdrawals,
			{ params }
		);
		return response.data;
	},

	// Get all withdrawals (manager/admin only)
	async getWithdrawals(
		params?: WithdrawalsListParams
	): Promise<WithdrawalsListResponse> {
		const response = await apiClient.get(API_ENDPOINTS.withdrawals.all, {
			params,
		});
		return response.data;
	},

	// Get withdrawal balance information
	async getWithdrawalBalance(): Promise<WithdrawalBalanceResponse> {
		const response = await apiClient.get(API_ENDPOINTS.withdrawals.balance);
		return response.data;
	},

	// Validate user password for withdrawal (using separate axios instance to avoid 401 interceptor)
	async validatePassword(
		password: string
	): Promise<{ message: string; data: { is_valid: boolean } }> {
		// Create axios instance without interceptors to avoid auto-logout on 401
		const authClient = axios.create({
			baseURL: API_BASE_URL,
			timeout: 10000,
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Add auth token manually
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("access_token");
			if (token) {
				authClient.defaults.headers.Authorization = `Bearer ${token}`;
			}
		}

		try {
			const response = await authClient.post(
				API_ENDPOINTS.withdrawals.validatePassword,
				{ password }
			);
			return response.data;
		} catch (error: unknown) {
			const axiosError = error as { response?: { status?: number, data?: { message?: string } } };
			// If 401, it means password is invalid, return structured response
			if (axiosError.response?.status === 401) {
				return {
					message: "Invalid password",
					data: { is_valid: false },
				};
			}
			// Re-throw other errors
			throw error;
		}
	},

	// Check if user can withdraw specified amount
	async checkBalance(amount: number): Promise<{
		message: string;
		data: { can_withdraw: boolean; available_balance: number };
	}> {
		const response = await apiClient.post(
			API_ENDPOINTS.withdrawals.checkBalance,
			{ amount }
		);
		return response.data;
	},

	// Create withdrawal request
	async createWithdrawal(data: CreateWithdrawalData): Promise<WithdrawalDetailResponse> {
		// Convert camelCase to snake_case for API
		const apiData = {
			amount: data.amount,
			bank_name: data.bankName,
			account_number: data.accountNumber,
			account_holder_name: data.accountHolderName,
			password: data.password,
			notes: data.notes
		};

		const response = await apiClient.post(
			API_ENDPOINTS.withdrawals.create,
			apiData
		);
		return response.data;
	},

	// Get withdrawal by ID
	async getWithdrawalById(id: number): Promise<WithdrawalDetailResponse> {
		const response = await apiClient.get(
			API_ENDPOINTS.withdrawals.byId(id)
		);
		return response.data;
	},

	// Get withdrawal detail by ID (alias for consistency)
	async getWithdrawalDetail(id: number): Promise<WithdrawalDetailResponse> {
		const response = await apiClient.get(
			API_ENDPOINTS.withdrawals.byId(id)
		);
		return response.data;
	},

	// Update withdrawal status (with proof payment)
	async updateWithdrawalStatus(
		id: number,
		status: string,
		notes?: string,
		proofPaymentFile?: File
	): Promise<WithdrawalDetailResponse> {
		const formData = new FormData();
		formData.append("status", status);
		if (notes) formData.append("notes", notes);
		if (proofPaymentFile)
			formData.append("proofPaymentFile", proofPaymentFile);

		const response = await apiClient.patch(
			API_ENDPOINTS.withdrawals.updateStatus(id),
			formData,
			{
				headers: { "Content-Type": "multipart/form-data" },
			}
		);
		return response.data;
	},
};
