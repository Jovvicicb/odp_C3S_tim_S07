export class GetFollowingDto {
    constructor(
        public userId: number,
        public page: number,
        public limit: number
    ){}
}