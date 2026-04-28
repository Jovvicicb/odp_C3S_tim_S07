export class UpdatePostDto {
    constructor(
        public title?: string,
        public content?: string,
        public mediaUrl?: string | null
    ){}
}