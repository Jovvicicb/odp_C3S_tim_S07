export type PostDto = {
  id: number;
  title: string;
  content: string;
  mediaUrl: string | null;
  authorId: number;
  communityId: number;
  createdAt: string;
  updatedAt: string | null;
};