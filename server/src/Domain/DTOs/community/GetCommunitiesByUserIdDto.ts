export class GetCommunitiesByUserIdDto{
    constructor(
        public userId:number,
        public page:number,
        public limit:number
    ){}
}