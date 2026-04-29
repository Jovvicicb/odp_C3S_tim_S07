import { ServiceResult } from "../../types/service/ServiceResult";

export interface IPostLikeService {
    like(userId: number, postId: number): Promise<ServiceResult>;
}