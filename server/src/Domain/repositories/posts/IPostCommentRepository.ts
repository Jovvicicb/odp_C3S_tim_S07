export interface IPostCommentRepository {
   countByPostIds(postIds: number[]): Promise<Record<number, number>>;
}
 