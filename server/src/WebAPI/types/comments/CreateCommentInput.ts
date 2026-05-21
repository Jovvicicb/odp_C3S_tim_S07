export type CreateCommentInput = {
  content?: string;
  postId?: string | number;
  parentId?: string | number | null;
  userId: number;
};