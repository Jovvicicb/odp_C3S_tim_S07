import { PaginatedListDto } from "../common/PaginatedListDto";
import { CommunityDto } from "./CommunityDto";
import { CommunityMemberDetailsDto } from "./CommunityMemberDetailsDto";
import { CommunityViewerPermissionsDto } from "./CommunityViewerPermissionsDto";

export class CommunityDetailsDto {
  constructor(
    public community: CommunityDto,
    public members: PaginatedListDto<CommunityMemberDetailsDto> | null,
    public canViewContent: boolean,
    public permissions: CommunityViewerPermissionsDto
  ) {}
}
