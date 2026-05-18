import type { PostTagDto } from "../tags/PostTagDto";

export type PostWithDetailsDto = {
  id: number;
  title: string;
  content: string;
  mediaUrl: string | null;
  authorId: number;
  communityId: number;
  createdAt: string;
  updatedAt: string | null;
  tags: PostTagDto[];
  likeCount: number;
  commentCount: number;
};