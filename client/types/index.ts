export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface ApiError {
  detail: string;
  statusCode?: number;
}

export type Theme = "light" | "dark" | "system";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
