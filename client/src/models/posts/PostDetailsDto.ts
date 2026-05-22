import type { PaginatedListDto } from "../common/PaginatedListDto";
import type { CommunityDto } from "../communities/CommunityDto";
import type { UserDto } from "../users/UserDto";
import type { CommentTreeDto } from "../comments/CommentTreeDto";
import type { PostViewerPermissionsDto } from "./PostViewerPermissionsDto";
import type { PostTagDto } from "../tags/PostTagDto";

export type PostDetailsDto = {
  id: number;
  title: string;
  content: string;
  mediaUrl: string | null;
  author: UserDto | null;
  community: CommunityDto;
  createdAt: string;
  updatedAt: string | null;
  tags: PostTagDto[];
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  permissions: PostViewerPermissionsDto;
  comments: PaginatedListDto<CommentTreeDto>;
};