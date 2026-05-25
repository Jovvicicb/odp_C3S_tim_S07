import type { PostTagDto } from "../tags/PostTagDto";

export type PostWithDetailsDto = {
  id: number;
  title: string;
  content: string;
  mediaUrl: string | null;
  authorId: number;
  authorUsername: string | null;
  communityId: number;
  createdAt: string;
  updatedAt: string | null;
  tags: PostTagDto[];
  likeCount: number;
  commentCount: number;
};