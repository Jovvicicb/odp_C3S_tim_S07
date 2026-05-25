import { useState } from "react";
import { commentApi } from "../../../../api_services/comments/CommentAPIService";
import { CommentMessages } from "../../../../constants/messages/comment/CommentMessages";
import { useToast } from "../../../toast/useToast";

type Props = {
  reloadPostDetails: () => Promise<void>;
};

export function useCommentModerationActions({ reloadPostDetails }: Props) {
  const { showToast } = useToast();

  const [loadingCommentDeleteId, setLoadingCommentDeleteId] = useState<
    number | null
  >(null);

  const [loadingCommentFlagId, setLoadingCommentFlagId] = useState<
    number | null
  >(null);

  const [commentModerationError, setCommentModerationError] = useState("");

  const handleDeleteComment = async (commentId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    setLoadingCommentDeleteId(commentId);
    setCommentModerationError("");

    try {
      const res = await commentApi.delete(commentId);

      if (!res.success) {
        setCommentModerationError(res.message ?? CommentMessages.deleteFailed);
        return;
      }

      showToast({
        type: "success",
        message: res.message ?? "Comment deleted successfully",
      });

      await reloadPostDetails();
    } catch {
      setCommentModerationError(CommentMessages.deleteFailed);
    } finally {
      setLoadingCommentDeleteId(null);
    }
  };

  const handleFlagComment = async (commentId: number) => {
    setLoadingCommentFlagId(commentId);
    setCommentModerationError("");

    try {
      const res = await commentApi.flag(commentId);

      if (!res.success) {
        setCommentModerationError(res.message ?? CommentMessages.flagFailed);
        return;
      }

      showToast({
        type: "success",
        message: res.message ?? "Comment flagged successfully",
      });

      await reloadPostDetails();
    } catch {
      setCommentModerationError(CommentMessages.flagFailed);
    } finally {
      setLoadingCommentFlagId(null);
    }
  };

  const handleUnflagComment = async (commentId: number) => {
    setLoadingCommentFlagId(commentId);
    setCommentModerationError("");

    try {
      const res = await commentApi.unflag(commentId);

      if (!res.success) {
        setCommentModerationError(res.message ?? CommentMessages.unflagFailed);
        return;
      }

      showToast({
        type: "success",
        message: res.message ?? "Comment unflagged successfully",
      });

      await reloadPostDetails();
    } catch {
      setCommentModerationError(CommentMessages.unflagFailed);
    } finally {
      setLoadingCommentFlagId(null);
    }
  };

  return {
    handleDeleteComment,
    handleFlagComment,
    handleUnflagComment,
    loadingCommentDeleteId,
    loadingCommentFlagId,
    commentModerationError,
  };
}