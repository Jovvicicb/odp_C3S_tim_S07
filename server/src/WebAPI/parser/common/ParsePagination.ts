export const parsePagination = (pageParam?: string, limitParam?: string
): { page: number; limit: number } => {
  const page = parseInt(pageParam ?? "1", 10);
  const limit = Math.min(parseInt(limitParam ?? "20", 10), 100);

  return { page, limit };
};