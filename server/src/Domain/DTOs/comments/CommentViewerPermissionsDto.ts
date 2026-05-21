export class CommentViewerPermissionsDto {
  constructor(
    public canUpdate: boolean,
    public canDelete: boolean,
    public canLike: boolean,
    public canReply: boolean,
    public canFlag: boolean
  ) {}
}