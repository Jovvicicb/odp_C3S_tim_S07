export class PostViewerPermissionsDto {
  constructor(
    public canEditPost: boolean,
    public canDeletePost: boolean,
    public canManageTags: boolean,
    public canLikePost: boolean,
    public canComment: boolean,
    public canModerateComments: boolean
  ) {}
}