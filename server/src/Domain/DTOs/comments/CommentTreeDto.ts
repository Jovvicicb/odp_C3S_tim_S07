import { CommentViewerPermissionsDto } from "./CommentViewerPermissionsDto";

export class CommentTreeDto {
  public constructor(
    public id: number,
    public content: string,
    public userId: number,
    public postId: number,
    public parentId: number | null,
    public isDeleted: boolean,
    public isFlagged: boolean,
    public likeCount: number,
    public likedByCurrentUser: boolean,
    public permissions: CommentViewerPermissionsDto,
    public createdAt: Date,
    public replies: CommentTreeDto[] = []
  ) {}
}