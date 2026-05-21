import type { CommentViewerPermissionsDto } from "./CommentViewerPermissionsDto";

export type CommentTreeDto = {
  id: number;
  content: string;
  userId: number;
  postId: number;
  parentId: number | null;
  isDeleted: boolean;
  isFlagged: boolean;
  likeCount: number;
  likedByCurrentUser: boolean;
  permissions: CommentViewerPermissionsDto;
  createdAt: string;
  replies: CommentTreeDto[];
};