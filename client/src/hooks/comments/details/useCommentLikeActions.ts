import { useState, type Dispatch, type SetStateAction } from "react";
import type { PostDetailsDto } from "../../../models/post/PostDetailsDto";
import { commentApi } from "../../../api_services/comments/CommentAPIService";
import { CommentMessages } from "../../../constants/messages/comment/CommentMessages";


type Props = {
  setPostDetails: Dispatch<SetStateAction<PostDetailsDto | null>>;
};

function updateCommentLikeState(
  current: PostDetailsDto,
  commentId: number,
  likedByCurrentUser: boolean,
): PostDetailsDto {
  return {
    ...current,
    comments: {
      ...current.comments,
      items: current.comments.items.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likedByCurrentUser,
            likeCount: likedByCurrentUser
              ? comment.likeCount + 1
              : Math.max(0, comment.likeCount - 1),
          };
        }

        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  likedByCurrentUser,
                  likeCount: likedByCurrentUser
                    ? reply.likeCount + 1
                    : Math.max(0, reply.likeCount - 1),
                }
              : reply,
          ),
        };
      }),
    },
  };
}

export function useCommentLikeActions({ setPostDetails }: Props) {
  const [loadingCommentLikeId, setLoadingCommentLikeId] = useState<
    number | null
  >(null);

  const [commentLikeError, setCommentLikeError] = useState("");

  const handleLikeComment = async (commentId: number) => {
    setLoadingCommentLikeId(commentId);
    setCommentLikeError("");

    try {
      const res = await commentApi.like(commentId);

      if (!res.success) {
        setCommentLikeError(res.message ?? CommentMessages.likeFailed);
        return;
      }

      setPostDetails((current) =>
        current ? updateCommentLikeState(current, commentId, true) : current,
      );
    } catch {
      setCommentLikeError(CommentMessages.likeFailed);
    } finally {
      setLoadingCommentLikeId(null);
    }
  };

  const handleUnlikeComment = async (commentId: number) => {
    setLoadingCommentLikeId(commentId);
    setCommentLikeError("");

    try {
      const res = await commentApi.unlike(commentId);

      if (!res.success) {
        setCommentLikeError(res.message ?? CommentMessages.unlikeFailed);
        return;
      }

      setPostDetails((current) =>
        current ? updateCommentLikeState(current, commentId, false) : current,
      );
    } catch {
      setCommentLikeError(CommentMessages.unlikeFailed);
    } finally {
      setLoadingCommentLikeId(null);
    }
  };

  return {
    handleLikeComment,
    handleUnlikeComment,
    loadingCommentLikeId,
    commentLikeError,
  };
}