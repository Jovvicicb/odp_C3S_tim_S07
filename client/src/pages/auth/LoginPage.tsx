import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LoginForm } from "../../components/auth/login/LoginForm";
import { authApi } from "../../api_services/auth/AuthAPIService";
import { useAuth } from "../../hooks/auth/useAuthHook";

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    navigate(user.role === "admin" ? "/admin" : "/feed");
  }, [isAuthenticated, user, navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] flex items-center justify-center px-6">
      <div className="absolute top-[-10%] left-[-10%] h-105 w-105 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] h-105 w-105 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm authApi={authApi} />
      </div>
    </main>
  );
}
