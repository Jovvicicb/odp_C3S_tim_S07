import type { PaginatedListDto } from "../common/PaginatedListDto";
import type { UserDto } from "../user/UserDto";
import type { CommunityDto } from "./CommunityDto";

export type CommunityDetailsDto = {
  community: CommunityDto;
  members: PaginatedListDto<UserDto> | null;
  canViewContent: boolean;
};