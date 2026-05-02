import { CreateCommentDto } from "../../DTOs/comments/CreateCommentDto";
import { UpdateCommentDto } from "../../DTOs/comments/UpdateCommentDto";
import { Comment } from "../../models/Comment";

export interface ICommentRepository {
  create(dto: CreateCommentDto): Promise<Comment>;
  update(id: number, dto: UpdateCommentDto): Promise<boolean>;
  softDelete(id: number): Promise<boolean>;
  findById(id: number): Promise<Comment>;
}