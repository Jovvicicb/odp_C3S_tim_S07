import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateRegister = (u: string, e: string, p: string): ValidationResult => {
  if (!u || u.trim().length < 3 || u.length > 40 || !/^[a-zA-Z0-9-]+$/.test(u))
    return { valid: false, message: "Username must be 3-40 alphanumeric characters" };
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    return { valid: false, message: "Invalid email address" };
  if (!p || p.length < 8 || !/[A-Z]/.test(p) || !/[0-9]/.test(p))
    return { valid: false, message: "Password must be 8+ chars with at least one uppercase and one number" };
  return { valid: true };
};