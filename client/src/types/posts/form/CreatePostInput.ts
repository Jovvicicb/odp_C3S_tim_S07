export type CreatePostInput = {
  title: string;
  content: string;
  communityId: number | null;
  imageFile: File | null;
};