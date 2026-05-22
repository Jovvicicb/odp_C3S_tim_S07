export type CreateCommentInput = {
  postId: number;
  content: string;
  parentId?: number | null;
};