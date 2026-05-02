import { CreateCommentDto } from "../../DTOs/comments/CreateCommentDto";
import { Comment } from "../../models/Comment";

export interface ICommentRepository {
  create(dto: CreateCommentDto): Promise<Comment>;
  softDelete(id: number): Promise<boolean>;
  findById(id: number): Promise<Comment>;
}