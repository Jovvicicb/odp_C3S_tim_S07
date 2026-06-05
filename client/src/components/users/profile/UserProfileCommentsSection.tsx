import { CountBadge } from "../../ui/badge/CountBadge";
import { Pagination } from "../../ui/pagination/Pagination";
import { SectionEmptyState } from "../../ui/empty/SectionEmptyState";
import { SectionCard } from "../../ui/card/SectionCard";
import { Spinner } from "../../ui/spinner/Spinner";

import type { UserProfileCommentDto } from "../../../models/comments/UserProfileCommentDto";

import { UserProfileCommentCard } from "./UserProfileCommentCard";

type Props = {
  comments: UserProfileCommentDto[];
  loading: boolean;
  isOwnProfile: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function UserProfileCommentsSection({
  comments,
  loading,
  isOwnProfile,
  page,
  limit,
  total,
  onPageChange,
}: Props) {
  return (
    <SectionCard
      label="Profile comments"
      title="Comments"
      description={
        isOwnProfile
          ? "Comments you shared across posts you can view."
          : "Comments this user shared on posts you can view."
      }
      action={<CountBadge count={total} singular="comment" plural="comments" />}
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : comments.length === 0 ? (
        <SectionEmptyState
          title={
            isOwnProfile
              ? "You have not commented yet."
              : "No visible comments."
          }
          description={
            isOwnProfile
              ? "Join discussions by commenting on posts across communities."
              : "This user has no comments available for you to view."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5">
            {comments.map((comment) => (
              <UserProfileCommentCard key={comment.id} comment={comment} />
            ))}
          </div>

          <Pagination
            page={page}
            total={total}
            pageSize={limit}
            onChange={onPageChange}
          />
        </>
      )}
    </SectionCard>
  );
}
