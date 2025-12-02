/**
 * Type-safe filter definitions for API requests
 */

export type FilterValue = string | number | boolean | null | undefined;

export type FilterParams = Record<string, FilterValue>;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
}

export type CourseFilters = FilterParams & PaginationParams & SortParams & SearchParams & {
  topicId?: number;
  subjectId?: number;
  status?: 'published' | 'draft' | 'archived';
};

export type UserFilters = FilterParams & PaginationParams & SortParams & SearchParams & {
  role?: 'mentors' | 'students';
  status?: 'active' | 'inactive';
};

export type WithdrawalFilters = FilterParams & PaginationParams & SortParams & SearchParams & {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  date_from?: string;
  date_to?: string;
};