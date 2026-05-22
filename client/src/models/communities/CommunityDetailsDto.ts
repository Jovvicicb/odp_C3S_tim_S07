import type { PaginatedListDto } from "../common/PaginatedListDto";
import type { CommunityDto } from "./CommunityDto";
import type { CommunityMemberDetailsDto } from "./CommunityMemberDetailsDto";
import type { CommunityViewerPermissionsDto } from "./CommunityViewerPermissionsDto";

export type CommunityDetailsDto = {
  community: CommunityDto;
  members: PaginatedListDto<CommunityMemberDetailsDto> | null;
  canViewContent: boolean;
  permissions: CommunityViewerPermissionsDto;
};