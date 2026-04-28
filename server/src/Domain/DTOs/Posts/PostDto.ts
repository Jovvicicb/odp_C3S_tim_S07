export class PostDto {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public mediaUrl: string | null,
        public authorId: number,
        public communityId: number,
        public createdAt: Date,
        public updatedAt: Date
    ){}
}