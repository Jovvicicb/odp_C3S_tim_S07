import { useState } from "react";

import { postApi } from "../../api_services/posts/PostAPIService";
import { CommonMessages } from "../../constants/messages/common/CommonMessages";
import { PostMessages } from "../../constants/messages/post/PostMessages";

export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createPost = async (formData: FormData) => {
    setLoading(true);
    setError("");

    try {
      const res = await postApi.create(formData);

      if (!res.success || !res.data) {
        setError(res.message ?? PostMessages.createFailed);
        return null;
      }

      return res.data;
    } catch {
      setError(CommonMessages.unexpectedError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPost,
    loading,
    error,
    setError,
  };
}