export class CreatePostDto {
    constructor(
        public title: string,
        public content: string,
        public mediaUrl: string | null,
        public authorId: number,
        public communityId: number
    ){}
}