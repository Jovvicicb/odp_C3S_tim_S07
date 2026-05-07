import { CommentSortType } from "../../../Domain/enums/comments/CommentSortType";

export const validateCommentSort = (sortParam?: string): CommentSortType => {

  if (sortParam === CommentSortType.POPULAR) {
    return CommentSortType.POPULAR;
  }

  return CommentSortType.NEWEST;
};