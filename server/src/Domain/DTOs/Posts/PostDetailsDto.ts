import { CommentTreeDto } from "../comments/CommentTreeDto";
import { PostTagDto } from "../tags/PostTagDto";

export class PostDetailsDto {
  public constructor(
    public id: number,
    public title: string,
    public content: string,
    public mediaUrl: string | null,
    public authorId: number,
    public communityId: number,
    public createdAt: Date,
    public updatedAt: Date | null,
    public tags: PostTagDto[],
    public likeCount: number,
    public commentCount: number,
    public comments: CommentTreeDto[]
  ) {}
}