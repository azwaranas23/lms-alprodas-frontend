import { apiClient } from "~/lib/axios";
import { API_ENDPOINTS } from "~/constants/api";
import type {
	StudentTransactionsResponse,
	StudentTransactionsParams,
} from "~/types/student-transactions";

export const studentTransactionsService = {
	getTransactions: async (
		params: StudentTransactionsParams = {}
	): Promise<StudentTransactionsResponse> => {
		const { data } = await apiClient.get<StudentTransactionsResponse>(
			API_ENDPOINTS.transactions.all,
			{ params }
		);
		return data;
	},
};
