import { PaginatedListDto } from "../common/PaginatedListDto";
import { UserDto } from "../users/UserDto";
import { CommunityDto } from "./CommunityDto";

export class CommunityDetailsDto {
  constructor(
    public community: CommunityDto,
    public members: PaginatedListDto<UserDto> | null,
    public canViewContent: boolean
  ) {}
}
