export const CommunityMessages = {
  notFound:      "Community not found",
  created:       "Community created successfully",
  updated:       "Community updated successfully",
  deleted:       "Community deleted successfully",

  createFailed:  "Failed to create community",
  updateFailed:  "Failed to update community",
  deleteFailed:  "Failed to delete community",


  fetchAllSuccess: "Communities fetched successfully",
  fetchPublicSuccess: "Public communities fetched successfully",
  fetchOneSuccess: "Community details with members fetched successfully",
  fetchMineSuccess: "My communities fetched successfully",

  fetchAllFailed: "Failed to fetch communities",
  fetchPublicFailed: "Failed to fetch public communities",
  fetchOneFailed: "Failed to fetch community details with members",
  fetchMineFailed: "Failed to fetch my communities",

  alreadyMember: "User is already a member of this community",
  requestAlreadySent: "Join request already sent",
  bannedFromCommunity: "You are banned from this community",
  joined: "Successfully joined community",
  requestSent: "Join request sent",
  joinFailed: "Failed to join community",
  privateCommunity: "This community is private",

  left: "Successfully left community",
  leaveFailed: "Failed to leave community",
  notMember: "User is not a member of this community",
  ownerCannotLeave: "Community owner cannot leave the community",
  requestCancelled: "Join request cancelled",
  onlyModeratorCanUpdate: "Only community moderators can update this community",
  onlyModeratorCanDelete: "Only community moderators can delete this community",

  onlyModeratorCanChangeMemberRole: "Only community moderators can change member roles",
  memberNotFound: "Community member not found",
  memberNotActive: "Only active members can have their role changed",
  ownerRoleCannotBeChanged: "Community owner role cannot be changed",
  cannotChangeOwnMemberRole: "You cannot change your own community role",
  memberRoleAlreadySet: "Community member already has this role",
  memberRoleUpdated: "Community member role updated successfully",
  updateMemberRoleFailed: "Failed to update community member role",
    
  invalidType:   "Invalid community type",
  nameTaken: "Community name is already taken"
} as const;