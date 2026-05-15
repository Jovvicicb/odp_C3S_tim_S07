import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/not_found/NotFoundPage";

import FeedPage from "./pages/app/FeedPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import CreateCommunity from "./pages/app/CreateCommunity";
import CommunityDetailsPage from "./pages/app/CommunityDetailsPage";
import AdminCommunitiesPage from "./pages/admin/AdminCommunitiesPage";
import LandingPage from "./pages/public/LandingPage";
import ProfileSettingsPage from "./pages/app/ProfileSettingsPage";
import MyCommunitiesPage from "./pages/app/MyCommunitiesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User routes */}
      <Route
        path="/feed"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <FeedPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/communities/create"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <CreateCommunity />
          </ProtectedRoute>
        }
      />

      <Route
        path="/communities/:id"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <CommunityDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <ProfileSettingsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/communities/mine"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <MyCommunitiesPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/communities"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
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
