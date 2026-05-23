import type { CommunityDto } from "../../../models/communities/CommunityDto";

export function getCommunityMembershipLabel(
  status: CommunityDto["membershipStatus"],
  isOwner: boolean,
): string {
  if (isOwner) {
    return "You own this community";
  }

  if (status === "active") {
    return "You are a member";
  }

  if (status === "pending") {
    return "Join request pending";
  }

  if (status === "banned") {
    return "Access restricted";
  }

  return "Not joined yet";
}