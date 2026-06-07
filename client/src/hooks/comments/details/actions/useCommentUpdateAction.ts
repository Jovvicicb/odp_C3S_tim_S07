import { useState } from "react";
import { commentApi } from "../../../../api_services/comments/CommentAPIService";
import { CommentMessages } from "../../../../constants/messages/comment/CommentMessages";
import { validateUpdateComment } from "../../../../validators/comment/ValidateUpdateComment";
import { useToast } from "../../../toast/useToast";

type Props = {
  reloadPostDetails: () => Promise<void>;
};

export function useCommentUpdateAction({ reloadPostDetails }: Props) {
  const { showToast } = useToast();

  const [loadingCommentUpdateId, setLoadingCommentUpdateId] = useState<
    number | null
  >(null);

  const [commentUpdateError, setCommentUpdateError] = useState("");

  const handleUpdateComment = async (commentId: number, content: string) => {
    const validation = validateUpdateComment(content);

    if (!validation.valid || !validation.normalizedContent) {
      setCommentUpdateError(validation.message);
      return false;
    }

    setLoadingCommentUpdateId(commentId);
    setCommentUpdateError("");

    try {
      const res = await commentApi.update(
        commentId,
        validation.normalizedContent,
      );

      if (!res.success) {
        setCommentUpdateError(res.message ?? CommentMessages.updateFailed);
        return false;
      }

      showToast({
        type: "success",
        message: res.message ?? CommentMessages.updateSuccess,
      });

      await reloadPostDetails();

      return true;
    } catch {
      setCommentUpdateError(CommentMessages.updateFailed);
      return false;
    } finally {
      setLoadingCommentUpdateId(null);
    }
  };

  return {
    handleUpdateComment,
    loadingCommentUpdateId,
    commentUpdateError,
  };
}