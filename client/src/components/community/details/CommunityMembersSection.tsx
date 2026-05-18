import { UserCard } from "../../user/UserCard";
import type { PaginatedListDto } from "../../../models/common/PaginatedListDto";
import type { UserDto } from "../../../models/user/UserDto";

type Props = {
  members: PaginatedListDto<UserDto> | null;
  loadingUserId: number | null;
  onFollow: (userId: number) => void;
  onUnfollow: (userId: number) => void;
};

export function CommunityMembersSection({
  members,
  loadingUserId,
  onFollow,
  onUnfollow,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
      <h2 className="text-xl font-semibold tracking-tight text-white">
        Members
      </h2>

      {!members || members.items.length === 0 ? (
        <p className="mt-3 text-sm text-white/35">No members found.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {members.items.map((member) => (
            <UserCard
              key={member.id}
              user={member}
              showFollowAction
              followLoading={loadingUserId === member.id}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
            />
          ))}
        </div>
      )}
    </div>
  );
}
