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
  fetchOneSuccess : "Community fetched successfully",

  fetchAllFailed: "Failed to fetch communities",
  fetchPublicFailed: "Failed to fetch public communities",
  fetchOneFailed: "Failed to fetch community",

  alreadyMember: "User is already a member of this community",
  requestAlreadySent: "Join request already sent",
  bannedFromCommunity: "You are banned from this community",
  joined: "Successfully joined community",
  requestSent: "Join request sent",
  joinFailed: "Failed to join community",

  left: "Successfully left community",
  leaveFailed: "Failed to leave community",
  notMember: "User is not a member of this community",
  ownerCannotLeave: "Community owner cannot leave the community",
  requestCancelled: "Join request cancelled",
  
  invalidType:   "Invalid community type",
  nameTaken: "Community name is already taken"
} as const;