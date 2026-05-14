import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { Layout } from "../layout/Layout";
import { Spinner } from "../ui/UI";

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole: string;
}> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading)
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111f]">
        <div className="absolute top-[-10%] left-[-10%] h-105 w-105 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-105 w-105 rounded-full bg-indigo-500/10 blur-3xl" />
        <Spinner size={24} />
      </div>
    );

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (user?.role !== requiredRole)
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111f] px-6">
        <div className="absolute top-[-10%] left-[-10%] h-105 w-105 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-105 w-105 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 max-w-sm rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-center shadow-2xl shadow-red-950/20">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
            <span className="text-red-200">!</span>
          </div>

          <p className="mb-4 text-sm text-red-200">
            You don't have permission to access this page.
          </p>

          <button
            onClick={logout}
            className="text-xs text-white/45 underline transition-colors hover:text-white/75"
          >
            Sign out
          </button>
        </div>
      </div>
    );

  return <Layout>{children}</Layout>;
};
