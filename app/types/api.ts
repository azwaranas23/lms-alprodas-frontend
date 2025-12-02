export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  message: string;
  data: {
    items: T[];
    meta: {
      total: number;
      page: number;
      per_page: number;
      total_pages: number;
      has_next?: boolean;
      has_prev?: boolean;
    };
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export function createApiResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return { message, data };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}