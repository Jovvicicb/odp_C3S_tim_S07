import { CommunityType } from "../../enums/CommunityType";

export class GetCommunitiesDto{
    constructor(
        public page : number,
        public limit : number,
        public type?:CommunityType
    ){}
}