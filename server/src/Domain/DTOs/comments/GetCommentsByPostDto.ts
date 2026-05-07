import { CommentSortType } from "../../enums/comments/CommentSortType";

export class GetCommentsByPostDto {
  public constructor(
    public postId: number,
    public page: number,
    public limit: number,
    public sort: CommentSortType = CommentSortType.NEWEST
  ) {}
}