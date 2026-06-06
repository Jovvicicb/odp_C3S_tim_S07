import { CommentSortType } from "../../../Domain/enums/comments/CommentSortType";
import { StringNormalizer } from "../../../Shared/normalization/StringNormalizer";

export const validateCommentSort = (sortParam?: string | null): CommentSortType => {
  const normalizedSort = StringNormalizer.trim(sortParam).toLowerCase();

  if (normalizedSort === CommentSortType.POPULAR) {
    return CommentSortType.POPULAR;
  }

  return CommentSortType.NEWEST;
};