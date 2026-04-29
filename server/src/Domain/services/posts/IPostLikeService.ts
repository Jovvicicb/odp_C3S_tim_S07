import { ServiceResult } from "../../types/service/ServiceResult";

export interface IPostLikeService {
    like(userId: number, postId: number): Promise<ServiceResult>;
    unlike(userId: number, postId: number): Promise<ServiceResult>;
}