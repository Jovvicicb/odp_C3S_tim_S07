import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/not_found/NotFoundPage";

import FeedPage from "./pages/dashboard/FeedPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import CreateCommunity from "./pages/communities/CreateCommunityPage";
import CommunityDetailsPage from "./pages/communities/CommunityDetailsPage";
import AdminCommunitiesPage from "./pages/admin/AdminCommunitiesPage";
import LandingPage from "./pages/public/LandingPage";
import EditUserProfilePage from "./pages/users/EditUserProfilePage";
import MyCommunitiesPage from "./pages/communities/MyCommunitiesPage";
import DiscoverCommunitiesPage from "./pages/communities/DiscoverCommunitiesPage";
import FollowersPage from "./pages/users/FollowersPage";
import FollowingPage from "./pages/users/FollowingPage";
import SearchUsersPage from "./pages/users/SearchUsersPage";
import CreatePostPage from "./pages/posts/CreatePostPage";
import PostDetailsPage from "./pages/posts/PostDetailsPage";
import EditPostPage from "./pages/posts/EditPostPage";
import AdminTagsPage from "./pages/admin/AdminTagsPage";
import EditCommunityPage from "./pages/communities/EditCommunityPage";
import UserProfilePage from "./pages/users/UserProfilePage";

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
        path="/communities"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DiscoverCommunitiesPage />
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
        path="/users/:id"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <UserProfilePage />
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
      <Route
        path="/users/search"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <SearchUsersPage />
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
        path="/posts/:id"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <PostDetailsPage />
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

      <Route path="/" element={<LandingPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
