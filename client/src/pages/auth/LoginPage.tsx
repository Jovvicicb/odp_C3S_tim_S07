import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm";
import { authApi } from "../../api_services/auth/AuthAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    navigate(user.role === "admin" ? "/admin" : "/dashboard");
  }, [isAuthenticated, user, navigate]);

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <LoginForm authApi={authApi} />
    </main>
  );
}
