// TODO: Replace EntityDto and CreateEntityDto with your domain types
import type { CommunityDto } from "../../models/community/CommunityDto";
import type { CommunityType,PaginatedListDto ,ApiResponse} from "../../types/community/CommunityTypes";

export interface ICommunityAPIService {
  getAll(page: number, limit: number,type?:CommunityType): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getById(id: number): Promise<ApiResponse<CommunityDto>>;
  getByUserId(userId: number,page:number,limit:number): Promise<ApiResponse<PaginatedListDto<CommunityDto>>>;
  getById(id: number): Promise<ApiResponse<CommunityDto>>;
  create(formData: FormData): Promise<ApiResponse<CommunityDto>>;
  update(id: number, payload: Partial<CommunityDto>): Promise<ApiResponse<void>>;
  delete(id: number): Promise<ApiResponse<void>>;
}
