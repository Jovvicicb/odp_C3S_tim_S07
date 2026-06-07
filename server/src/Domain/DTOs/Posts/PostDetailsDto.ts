import { CommentTreeDto } from "../comments/CommentTreeDto";
import { PaginatedListDto } from "../common/PaginatedListDto";
import { CommunityDto } from "../communities/CommunityDto";
import { PostTagDto } from "../tags/PostTagDto";
import { UserDto } from "../users/UserDto";
import { PostViewerPermissionsDto } from "./PostViewerPermissionsDto";

export class PostDetailsDto {
  public constructor(
    public id: number,
    public title: string,
    public content: string,
    public mediaUrl: string | null,
    public author: UserDto | null,
    public community: CommunityDto,
    public createdAt: Date,
    public updatedAt: Date | null,
    public tags: PostTagDto[],
    public likeCount: number,
    public commentCount: number,
    public likedByCurrentUser: boolean,
    public permissions: PostViewerPermissionsDto,
    public comments: PaginatedListDto<CommentTreeDto>
  ) {}
}