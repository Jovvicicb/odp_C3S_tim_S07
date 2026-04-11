import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateRegister = (u: string, e: string, p: string ,fullname: string, bio:string,file?: Express.Multer.File): ValidationResult => {
 
  if (!u.trim()){
    return { valid: false, message: "Username is required" };
  }

  if (u.trim().length < 3 || u.trim().length > 40) {
    return { valid: false, message: "Username must be between 3 and 40 characters"};
  }

  if (!/^[A-Za-z0-9-]+$/.test(u.trim())) {
     return { valid: false, message: "Username can contain only letters, numbers and dash(-)"};
  }

  if (fullname.trim().length < 3 || fullname.trim().length > 100) {
    return { valid: false, message: "FullName must be between 3 and 100 characters" };
  }

  if (!/^[A-Za-z\s]+$/.test(fullname.trim())) {
    return { valid: false, message: "Full name can contain only letters and spaces" };
  }

  if (!e.trim()) {
    return { valid: false, message: "Email is required" };
  }
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(e.trim())) 
  {
    return { valid: false, message: "Email format is not valid" }; 
  }


  if (!p) {
    return { valid: false, message: "Password is required" };
  }
    
  if (p.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }

  if (!/[A-Z]/.test(p)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }

  if (!/[0-9]/.test(p)) {
     return { valid: false, message: "Password must contain at least one number" };
  }


  if (bio.trim().length > 300) {
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