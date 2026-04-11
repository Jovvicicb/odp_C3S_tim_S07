import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateLogin = (u: string, p: string): ValidationResult => {
  if (!u.trim()){
    return { valid: false, message: "Username is required" };
  }

  if (u.trim().length < 3 || u.trim().length > 40) {
    return { valid: false, message: "Username must be between 3 and 40 characters"};
  }

  if (!/^[A-Za-z0-9-]+$/.test(u.trim())) {
     return { valid: false, message: "Username can contain only letters, numbers and dash(-)"};
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

  return { valid: true };
};