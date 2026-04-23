import { CommunityType } from "../../enums/communities/CommunityType";

export class UpdateCommunityDto{
    constructor(
        public name?: string,
        public description?: string,
        public rules?: string,
        public type?: CommunityType,
        public avatar?: string
    ){}
}