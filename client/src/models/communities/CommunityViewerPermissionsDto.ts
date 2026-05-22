export type CommunityViewerPermissionsDto = {
  isOwner: boolean;
  isModerator: boolean;
  canUpdateCommunity: boolean;
  canDeleteCommunity: boolean;
  canManageMembers: boolean;
  canProcessJoinRequests: boolean;
  canCreatePost: boolean;
};