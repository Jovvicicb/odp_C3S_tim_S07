export type CreatePostInput = {
  title?: string | null;
  content?: string | null;
  communityId?: string | number | null;
  authorId: number;
};