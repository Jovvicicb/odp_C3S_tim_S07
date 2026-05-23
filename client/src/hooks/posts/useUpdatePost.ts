import { useState } from "react";
import { postApi } from "../../api_services/posts/PostAPIService";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";
import { PostMessages } from "../../constants/messages/post/PostMessages";

export function useUpdatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updatePost = async (postId: number, formData: FormData) => {
    setLoading(true);
    setError("");

    try {
      const res = await postApi.update(postId, formData);

      if (!res.success) {
        setError(res.message ?? PostMessages.updateFailed);
        return false;
      }

      return true;
    } catch {
      setError(CommonMessages.unexpectedError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePost,
    loading,
    error,
    setError,
  };
}