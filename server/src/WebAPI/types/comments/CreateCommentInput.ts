export type CreateCommentInput = {
  content?: string;
  postId?: string;
  parentId?: string;
  userId: number;
};