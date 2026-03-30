import { ValidationResult } from "../../../Domain/types/ValidationResult";

export const validateLogin = (u: string, p: string): ValidationResult => {
  if (!u || u.trim().length < 3) return { valid: false, message: "Username must be at least 3 characters" };
  if (!p || p.length < 8) return { valid: false, message: "Password must be at least 8 characters" };
  return { valid: true };
};