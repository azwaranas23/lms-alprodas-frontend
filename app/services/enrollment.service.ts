import { apiClient } from "~/lib/axios";
import { API_ENDPOINTS } from "~/constants/api";

export interface EnrollWithTokenPayload {
  course_id: number;
  token: string;
}

export const enrollmentService = {
  enrollWithToken: async (payload: EnrollWithTokenPayload) => {
    const { data } = await apiClient.post(
      API_ENDPOINTS.enrollments.byToken,
      payload
    );
    return data;
  },
};
