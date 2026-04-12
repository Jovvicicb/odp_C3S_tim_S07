import { ValidationResult } from "../../../Domain/types/ValidationResult";


export const validateRegister = (normalizedUserName: string, normalizedFullname: string, normalizedEmail: string ,password: string, normalizedBio:string,file?: Express.Multer.File): ValidationResult => {
 
  if (!normalizedUserName){
    return { valid: false, message: "Username is required" };
  }

  if (normalizedUserName.length < 3 || normalizedUserName.length > 40) {
    return { valid: false, message: "Username must be between 3 and 40 characters"};
  }

  if (!/^[A-Za-z0-9-]+$/.test(normalizedUserName)) {
     return { valid: false, message: "Username can contain only letters, numbers and dash(-)"};
  }
  if(normalizedFullname){
    if (normalizedFullname.length < 3 || normalizedFullname.length > 100) {
      return { valid: false, message: "FullName must be between 3 and 100 characters" };
    }
    
    if (!/^[A-Za-z\s]+$/.test(normalizedFullname)) {
      return { valid: false, message: "Full name can contain only letters and spaces" };
    }
  } 

  if (!normalizedEmail) {
    return { valid: false, message: "Email is required" };
  }
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(normalizedEmail)) 
  {
    return { valid: false, message: "Email format is not valid" }; 
  }

  if (!password) {
    return { valid: false, message: "Password is required" };
  }
    
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }

  if (!/[0-9]/.test(password)) {
     return { valid: false, message: "Password must contain at least one number" };
  }
  if (normalizedBio.length > 300) {
     return { valid: false, message: "Bio must be at most 300 characters" };
  }
  
  if (file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        message: "Only JPG, PNG or WEBP images are allowed",
      };
    }

    if (file.size > 2 * 1024 * 1024) {
      return {
        valid: false,
        message: "Image must be smaller than 2MB",
      };
    }
  }   

  return { valid: true };
};