import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateCreateCommunity  = (normalizedName: string, normalizedDescription:string ,normalizedRules:string,normalizedType:string,avatar?: Express.Multer.File): ValidationResult => {

    if (!normalizedName) {
      return { valid: false, message: "Community name is required" };
    }

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      return { valid: false, message: "Community name must be between 2 and 80 characters" };
    }

    if (normalizedDescription.length > 500) {
        return { valid: false, message: "Description must be at most 500 characters" };
    }

    if (normalizedRules.length > 500) {
      return { valid: false, message: "Rules must be at most 500 characters" };
    }

    if (normalizedType !== "public" && normalizedType !== "private") {
      return { valid: false, message: "Invalid community type" };
    }

    if (avatar) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedTypes.includes(avatar.mimetype)) {
        return {
            valid: false,
            message: "Only JPG, PNG or WEBP images are allowed",
        };
        }

        if (avatar.size > 2 * 1024 * 1024) {
        return {
            valid: false,
            message: "Image must be smaller than 2MB",
        };
         }
     }
  
    
  return { valid: true };
};