export class UserFollow{
    constructor(
        public id: number = 0,
        public followerId: number = 0,
        public followingId: number = 0,
        public followedAt?: Date
    ){}
}