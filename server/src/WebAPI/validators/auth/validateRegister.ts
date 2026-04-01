import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateRegister = (u: string, e: string, p: string ,fullname: string, bio:string): ValidationResult => {
  if (!u || u.trim().length < 3 || u.length > 40 || !/^[a-zA-Z0-9-]+$/.test(u))
    return { valid: false, message: "Username must be 3-40 alphanumeric characters" };
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    return { valid: false, message: "Invalid email address" };
  if (!p || p.length < 8 || !/[A-Z]/.test(p) || !/[0-9]/.test(p))
    return { valid: false, message: "Password must be 8+ chars with at least one uppercase and one number" };
  if (!fullname || fullname.trim().length < 3 || fullname.length > 40 || !/^[a-zA-Z0-9-]+$/.test(fullname)){
    return { valid: false, message: "FullName must be 3-40 alphanumeric characters" };
  }
  if (bio && bio.length > 300) {
    return { valid: false, message: "Bio must be max 300 characters" };
  }
  return { valid: true };
};