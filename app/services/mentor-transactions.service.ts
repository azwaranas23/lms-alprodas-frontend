import { apiClient } from "~/lib/axios";
import { API_ENDPOINTS } from "~/constants/api";
import type {
  MentorTransactionsResponse,
  MentorTransactionsParams,
} from "~/types/mentor-transactions";

export const mentorTransactionsService = {
  getTransactions: async (
    params: MentorTransactionsParams = {}
  ): Promise<MentorTransactionsResponse> => {
    const { data } = await apiClient.get<MentorTransactionsResponse>(
      API_ENDPOINTS.transactions.mentor.list,
      { params }
    );
    return data;
  },
};