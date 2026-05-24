import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { postApi } from "../../../../api_services/posts/PostAPIService";
import { PostMessages } from "../../../../constants/messages/post/PostMessages";
import { useToast } from "../../../toast/useToast";

export function usePostDeleteAction() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loadingPostDelete, setLoadingPostDelete] = useState(false);
  const [postDeleteError, setPostDeleteError] = useState("");

  const handleDeletePost = async (postId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    setLoadingPostDelete(true);
    setPostDeleteError("");

    try {
      const res = await postApi.delete(postId);

      if (!res.success) {
        setPostDeleteError(res.message ?? PostMessages.deleteFailed);
        return;
      }

      showToast({
        type: "success",
        message: res.message ?? "Post deleted successfully",
      });

      navigate(-1);
    } catch {
      setPostDeleteError(PostMessages.deleteFailed);
    } finally {
      setLoadingPostDelete(false);
    }
  };

  return {
    handleDeletePost,
    loadingPostDelete,
    postDeleteError,
  };
}