import { useContext } from "react";
import AuthContext from "../../contexts/auth/AuthContext";
import type { AuthContextType } from "../../types/auth/AuthContext";
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
