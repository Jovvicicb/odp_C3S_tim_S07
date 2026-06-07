import { CommunityType } from "../../enums/communities/CommunityType";

export class UpdateCommunityDto{
    constructor(
        public name?: string,
        public description?: string | null,
        public rules?: string | null,
        public type?: CommunityType,
        public avatar?: string | null
    ){}
}