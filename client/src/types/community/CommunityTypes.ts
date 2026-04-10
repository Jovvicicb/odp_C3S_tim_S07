export type CommunityType = "private" | "public" ;

export type PaginatedListDto<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
export type ApiResponse<T> = { success: boolean; message?: string; data?: T };