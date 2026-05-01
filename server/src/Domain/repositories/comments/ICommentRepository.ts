import { CreateCommentDto } from "../../DTOs/comments/CreateCommentDto";
import { Comment } from "../../models/Comment";

export interface ICommentRepository {
  create(dto: CreateCommentDto): Promise<Comment>;
  findById(id: number): Promise<Comment>;
}