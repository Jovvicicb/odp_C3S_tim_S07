import { ServiceResult } from "../../types/service/ServiceResult";

export interface ICommunityMemberService {
  join(communityId: number, userId: number): Promise<ServiceResult>;
}
