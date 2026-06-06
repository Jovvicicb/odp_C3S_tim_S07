import { PostSortType } from "../../../Domain/enums/posts/PostSortType";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";

export const validatePostSort = (sortParam?: string | null): PostSortType => {
  const normalizedSort = StringNormalizer.trim(sortParam).toLowerCase();

  if (normalizedSort === PostSortType.POPULAR) return PostSortType.POPULAR;
  if (normalizedSort === PostSortType.MOST_COMMENTED) return PostSortType.MOST_COMMENTED;

  return PostSortType.NEWEST;
};