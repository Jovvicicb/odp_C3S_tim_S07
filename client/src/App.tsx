import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import { PublicLayoutRoute } from "./components/routes/PublicLayoutRute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/not_found/NotFoundPage";

import LandingPage from "./pages/public/LandingPage";

import FeedPage from "./pages/dashboard/FeedPage";

import DiscoverCommunitiesPage from "./pages/communities/DiscoverCommunitiesPage";
import MyCommunitiesPage from "./pages/communities/MyCommunitiesPage";
import CreateCommunity from "./pages/communities/CreateCommunityPage";
import EditCommunityPage from "./pages/communities/EditCommunityPage";
import CommunityDetailsPage from "./pages/communities/CommunityDetailsPage";

import CreatePostPage from "./pages/posts/CreatePostPage";
import PostDetailsPage from "./pages/posts/PostDetailsPage";
import EditPostPage from "./pages/posts/EditPostPage";

import UserProfilePage from "./pages/users/profile/UserProfilePage";
import EditUserProfilePage from "./pages/users/profile/EditUserProfilePage";
import FollowersPage from "./pages/users/follow/FollowersPage";
import FollowingPage from "./pages/users/follow/FollowingPage";
import SearchUsersPage from "./pages/users/search/SearchUsersPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCommunitiesPage from "./pages/admin/AdminCommunitiesPage";
import AdminTagsPage from "./pages/admin/AdminTagsPage";

export default function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public routes */}
      <Route
        path="/"
        element={
          <PublicLayoutRoute>
            <LandingPage />
          </PublicLayoutRoute>
        }
      />

      <Route
        path="/communities/:id"
        element={
          <PublicLayoutRoute>
            <CommunityDetailsPage />
          </PublicLayoutRoute>
        }
      />

      <Route
        path="/posts/:id"
        element={
          <PublicLayoutRoute>
            <PostDetailsPage />
          </PublicLayoutRoute>
        }
      />

      <Route
        path="/users/:id"
        element={
          <PublicLayoutRoute>
            <UserProfilePage />
          </PublicLayoutRoute>
        }
      />

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
        path="/communities"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DiscoverCommunitiesPage />
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
        path="/communities/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <EditCommunityPage />
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

      <Route
        path="/communities/:communityId/posts/create"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <CreatePostPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/posts/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <EditPostPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/search"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <SearchUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <EditUserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id/followers"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <FollowersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/:id/following"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <FollowingPage />
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
            <AdminUsersPage />
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

      <Route
        path="/admin/tags"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminTagsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/404"
        element={
          <PublicLayoutRoute>
            <NotFoundPage />
          </PublicLayoutRoute>
        }
      />

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
