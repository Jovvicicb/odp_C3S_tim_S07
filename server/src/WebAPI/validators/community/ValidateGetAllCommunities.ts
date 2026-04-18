import { PaginationMessages } from "../../../Domain/constants/messages/common/PaginationMessages";
import { CommunityValidationMessages } from "../../../Domain/constants/messages/community/CommunityValidationMessages";
import { CommunityType } from "../../../Domain/enums/CommunityType";
import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateGetAllCommunities = (
    page:number,
    limit:number,
    type?:string
):ValidationResult => {
    if(isNaN(page) || page<1){
        return{valid: false, message: PaginationMessages.invalidPage};
    }
    if(isNaN(limit) || limit<1 || limit >100){
        return{valid: false, message: PaginationMessages.invalidLimit};
    }
    if (type && !Object.values(CommunityType).includes(type as CommunityType)) {
         return { valid: false, message: CommunityValidationMessages.invalidType };
    }
    return {valid:true};
};