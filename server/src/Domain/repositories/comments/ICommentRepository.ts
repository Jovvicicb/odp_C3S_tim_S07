import { CreateCommentDto } from "../../DTOs/comments/CreateCommentDto";
import { GetCommentsByPostDto } from "../../DTOs/comments/GetCommentsByPostDto";
import { UpdateCommentDto } from "../../DTOs/comments/UpdateCommentDto";
import { Comment } from "../../models/Comment";

export interface ICommentRepository {
  create(dto: CreateCommentDto): Promise<Comment>;
  update(id: number, dto: UpdateCommentDto): Promise<boolean>;
  softDelete(id: number): Promise<boolean>;
  findById(id: number): Promise<Comment>;
  findRootByPost(dto: GetCommentsByPostDto): Promise<{ comments: Comment[]; total: number }>;
  findRepliesByParentIds(parentIds: number[]): Promise<Comment[]>;
  updateFlagStatus(id: number, isFlagged: number): Promise<boolean>;
}