import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { postApi } from "../../../api_services/posts/PostAPIService";
import { CommonMessages } from "../../../constants/messages/common/CommonMessages";
import { PostMessages } from "../../../constants/messages/post/PostMessages";
import type { PostWithDetailsDto } from "../../../models/posts/PostWithDetailsDto";
import { useToast } from "../../toast/useToast";

type Props = {
  posts: PostWithDetailsDto[];
  page: number;
  setPosts: Dispatch<SetStateAction<PostWithDetailsDto[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export function useDeleteAdminPost({
  posts,
  page,
  setPosts,
  setTotal,
  setPage,
}: Props) {
  const { showToast } = useToast();

  const [loadingPostId, setLoadingPostId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleDeletePost = async (postId: number) => {
    setLoadingPostId(postId);
    setError("");

    try {
      const res = await postApi.delete(postId);

      if (!res.success) {
        setError(res.message ?? PostMessages.deleteFailed);
        return;
      }

      setPosts((current) => current.filter((post) => post.id !== postId));

      setTotal((current) => Math.max(0, current - 1));

      showToast({
        type: "success",
        message: res.message ?? PostMessages.deleteSuccess,
      });

      if (posts.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch {
      setError(CommonMessages.unexpectedError);
    } finally {
      setLoadingPostId(null);
    }
  };

  return {
    handleDeletePost,
    loadingPostId,
    error,
  };
}