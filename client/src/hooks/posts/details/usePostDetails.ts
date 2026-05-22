import { useCallback, useEffect, useState } from "react";
import { postApi } from "../../../api_services/posts/PostAPIService";
import { PostMessages } from "../../../constants/messages/post/PostMessages";
import type { PostDetailsDto } from "../../../models/posts/PostDetailsDto";
import type { CommentSortType } from "../../../types/comments/CommentSortType";

export function usePostDetails(
  postId: number | null,
  initialCommentsPage = 1,
  initialCommentsLimit = 10,
  initialCommentsSort: CommentSortType = "newest",
) {
  const [postDetails, setPostDetails] = useState<PostDetailsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [commentsPage, setCommentsPage] = useState(initialCommentsPage);
  const [commentsLimit, setCommentsLimit] = useState(initialCommentsLimit);
  const [commentsSort, setCommentsSort] = useState<CommentSortType>(initialCommentsSort);

  const fetchPostDetails = useCallback(async () => {
    if (!postId) {
      setPostDetails(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await postApi.getById(
        postId,
        commentsPage,
        commentsLimit,
        commentsSort,
      );

      if (!res.success || !res.data) {
        setPostDetails(null);
        setError(res.message ?? PostMessages.fetchDetailsFailed);
        return;
      }

      setPostDetails(res.data);
    } catch {
      setPostDetails(null);
      setError(PostMessages.fetchDetailsFailed);
    } finally {
      setLoading(false);
    }
  }, [postId, commentsPage, commentsLimit, commentsSort]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchPostDetails();
    });
  }, [fetchPostDetails]);

  return {
    postDetails,
    setPostDetails,
    loading,
    error,
    commentsPage,
    commentsLimit,
    commentsSort,
    setCommentsPage,
    setCommentsLimit,
    setCommentsSort,
    reload: fetchPostDetails,
  };
}