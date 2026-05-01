import { PostSortType } from "../../../Domain/enums/posts/PostSortType";

export const validatePostSort = (sortParam?: string): PostSortType => {
  if (sortParam === PostSortType.POPULAR) return PostSortType.POPULAR;
  if (sortParam === PostSortType.MOST_COMMENTED) return PostSortType.MOST_COMMENTED;

  return PostSortType.NEWEST;
};