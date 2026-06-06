export type CreateCommentInput = {
  content?: string | null;
  postId?: string | number;
  parentId?: string | number | null;
  userId: number;
};