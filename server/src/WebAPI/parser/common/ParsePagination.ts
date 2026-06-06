import { parseId } from "./ParseId";

export const parsePagination = (
  pageParam?: string,
  limitParam?: string,
): { page: number; limit: number } => {
  const page = pageParam ? parseId(pageParam) : 1;
  const limit = limitParam ? parseId(limitParam) : 20;

  return { page, limit };
};