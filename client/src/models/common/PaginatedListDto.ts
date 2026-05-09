export type PaginatedListDto<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};