import type { CommunityDto } from "../../../models/community/CommunityDto";

type Props = {
  community: CommunityDto;
};

export function CommunityLockedPanel({ community }: Props) {
  return (
    <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-8 shadow-xl shadow-sky-950/10">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        This community is private
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
        You need to be an active member to view posts, members and community
        content.
      </p>

      {community.membershipStatus === "pending" && (
        <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-200">
          Your join request is waiting for moderator approval.
        </p>
      )}

      {community.membershipStatus === "banned" && (
        <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          You are banned from this community.
        </p>
      )}
    </div>
  );
}
