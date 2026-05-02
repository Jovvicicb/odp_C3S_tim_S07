import { ServiceResult } from "../../types/service/ServiceResult";

export interface ICommentLikeService {
  like(userId: number, commentId: number): Promise<ServiceResult>;
}