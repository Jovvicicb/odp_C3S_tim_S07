import { useNavigate, useParams } from "react-router-dom";

import { Empty, ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { ActionButton } from "../../components/ui/ActionButton";

import { PostDetailsCard } from "../../components/post/details/PostDetailsCard";
import { PostCommentsSection } from "../../components/post/details/PostCommentsSection";

import { usePostDetails } from "../../hooks/posts/details/usePostDetails";
import { usePostDetailsActions } from "../../hooks/posts/details/usePostDetailsActions";
import { useCommentActions } from "../../hooks/comments/useCommentActions";

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const postId = Number(id);
  const parsedPostId = Number.isNaN(postId) ? null : postId;

  const {
    postDetails,
    setPostDetails,
    loading,
    error,
    commentsPage,
    commentsLimit,
    commentsSort,
    setCommentsPage,
    setCommentsSort,
    reload,
  } = usePostDetails(parsedPostId, 1, 10, "newest");

  const {
    handleLikePost,
    handleUnlikePost,
    handleDeletePost,
    loadingPostLike,
    loadingPostDelete,
    postActionError,
  } = usePostDetailsActions({
    setPostDetails,
  });

  const {
    handleCreateComment,
    handleLikeComment,
    handleUnlikeComment,
    loadingCommentCreate,
    loadingCommentLikeId,
    commentActionError,
  } = useCommentActions({
    reloadPostDetails: reload,
    setPostDetails,
  });

  const handleEditPost = (postId: number) => {
    navigate(`/posts/${postId}/edit`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!postDetails) {
    return <Empty message="Post not found." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Post Details"
        title={postDetails.title}
        action={<ActionButton variant="back" label="Back" />}
      />

      {(error || postActionError || commentActionError) && (
        <ErrorBox message={error || postActionError || commentActionError} />
      )}

      <PostDetailsCard
        post={postDetails}
        loadingPostLike={loadingPostLike}
        loadingPostDelete={loadingPostDelete}
        onLikePost={handleLikePost}
        onUnlikePost={handleUnlikePost}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
      />
      <PostCommentsSection
        postId={postDetails.id}
        comments={postDetails.comments}
        totalCommentCount={postDetails.commentCount}
        commentsPage={commentsPage}
        commentsLimit={commentsLimit}
        commentsSort={commentsSort}
        canComment={postDetails.permissions.canComment}
        loadingCommentCreate={loadingCommentCreate}
        loadingCommentLikeId={loadingCommentLikeId}
        onPageChange={setCommentsPage}
        onSortChange={setCommentsSort}
        onCreateComment={handleCreateComment}
        onLikeComment={handleLikeComment}
        onUnlikeComment={handleUnlikeComment}
      />
    </div>
  );
}
