export type UserProfileCommentDto = {
  id: number;
  content: string;
  userId: number;
  authorUsername: string | null;
  postId: number;
  postTitle: string | null;
  communityId: number;
  communityName: string | null;
  parentId: number | null;
  isDeleted: boolean;
  isFlagged: boolean;
  likeCount: number;
  createdAt: string;
};