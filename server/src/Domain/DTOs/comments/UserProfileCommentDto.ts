export class UserProfileCommentDto {
  public constructor(
    public id: number,
    public content: string,
    public userId: number,
    public authorUsername: string | null,
    public postId: number,
    public postTitle: string | null,
    public communityId: number,
    public communityName: string | null,
    public parentId: number | null,
    public isDeleted: boolean,
    public isFlagged: boolean,
    public likeCount: number,
    public createdAt: Date,
  ) {}
}