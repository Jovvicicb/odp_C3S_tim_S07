import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/not_found/NotFoundPage";

import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import CreateCommunity from "./pages/user/CreateCommunity";
import CommunityDetailsPage from "./pages/user/CommunityDetailsPage";
import AdminCommunitiesPage from "./pages/admin/AdminCommunitiesPage";
import LandingPage from "./pages/public/LandingPage";
import ProfileSettingsPage from "./pages/user/ProfileSettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/communities/create"
        element={
          <ProtectedRoute requiredRole="user">
            <CreateCommunity />
          </ProtectedRoute>
        }
      />

      <Route
        path="/communities/:id"
        element={
          <ProtectedRoute requiredRole="user">
            <CommunityDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredRole="user">
            <ProfileSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/communities"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminCommunitiesPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<LandingPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
