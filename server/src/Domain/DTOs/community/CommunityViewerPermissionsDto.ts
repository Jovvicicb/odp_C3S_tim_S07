export class CommunityViewerPermissionsDto {
  constructor(
    public isOwner: boolean,
    public isModerator: boolean,
    public canUpdateCommunity: boolean,
    public canDeleteCommunity: boolean,
    public canManageMembers: boolean,
    public canProcessJoinRequests: boolean,
    public canCreatePost: boolean
  ) {}
}