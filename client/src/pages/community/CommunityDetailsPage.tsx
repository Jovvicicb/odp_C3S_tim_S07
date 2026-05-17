import { useParams } from "react-router-dom";
import { Empty, ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { CommunityCard } from "../../components/community/CommunityCard";
import { useCommunityDetails } from "../../hooks/community/useCommunityDetails";
import { useCommunityMembership } from "../../hooks/community/useCommunityMembership";
import { useToast } from "../../hooks/toast/useToast";
import { useState } from "react";
import { ActionButton } from "../../components/ui/ActionButton";
import { UserCard } from "../../components/user/UserCard";
import { useUserFollow } from "../../hooks/users/useUserFollow";

export default function CommunityDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"posts" | "members">("posts");
  const communityId = Number(id);

  const { details, setDetails, loading, error, reload } = useCommunityDetails(
    Number.isNaN(communityId) ? null : communityId,
    1,
    10,
  );

  const {
    joinCommunity,
    leaveCommunity,
    loadingCommunityId,
    error: membershipError,
  } = useCommunityMembership();

  const {
    follow,
    unfollow,
    loadingUserId,
    error: followError,
  } = useUserFollow();

  const { showToast } = useToast();

  const handleJoin = async (id: number) => {
    const message = await joinCommunity(id);

    if (!message) return;

    setDetails((current) =>
      current
        ? {
            ...current,
            community: {
              ...current.community,
              membershipStatus:
                current.community.type === "public" ? "active" : "pending",
            },
            canViewContent:
              current.community.type === "public"
                ? true
                : current.canViewContent,
          }
        : current,
    );

    showToast({
      type: "success",
      message,
    });

    setTimeout(() => {
      void reload();
    }, 500);
  };

  const handleLeave = async (id: number) => {
    const message = await leaveCommunity(id);

    if (!message) return;

    setDetails((current) =>
      current
        ? {
            ...current,
            community: {
              ...current.community,
              membershipStatus: null,
            },
            canViewContent:
              current.community.type === "private"
                ? false
                : current.canViewContent,
          }
        : current,
    );

    showToast({
      type: "success",
      message,
    });

    setTimeout(() => {
      void reload();
    }, 500);
  };

  const handleFollow = async (userId: number) => {
    const message = await follow(userId);

    if (!message) return;

    setDetails((current) =>
      current
        ? {
            ...current,
            members: current.members
              ? {
                  ...current.members,
                  items: current.members.items.map((member) =>
                    member.id === userId
                      ? { ...member, followStatus: "following" }
                      : member,
                  ),
                }
              : current.members,
          }
        : current,
    );

    showToast({
      type: "success",
      message,
    });
  };

  const handleUnfollow = async (userId: number) => {
    const message = await unfollow(userId);

    if (!message) return;

    setDetails((current) =>
      current
        ? {
            ...current,
            members: current.members
              ? {
                  ...current.members,
                  items: current.members.items.map((member) =>
                    member.id === userId
                      ? { ...member, followStatus: "not_following" }
                      : member,
                  ),
                }
              : current.members,
          }
        : current,
    );

    showToast({
      type: "success",
      message,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!details) {
    return <Empty message="Community not found." />;
  }

  const { community, members, canViewContent } = details;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community"
        title={community.name}
        action={<ActionButton variant="back" label="Back" />}
      />

      {(error || membershipError || followError) && (
        <ErrorBox message={error || membershipError || followError} />
      )}

      <CommunityCard
        community={community}
        showMembershipAction
        actionLoading={loadingCommunityId === community.id}
        onJoin={handleJoin}
        onLeave={handleLeave}
      />

      {!canViewContent ? (
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
      ) : (
        <>
          <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-2 shadow-xl shadow-sky-950/10">
            <div className="grid grid-cols-2 gap-2">
              {(["posts", "members"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "border-sky-300/20 bg-sky-400/10 text-sky-100 shadow-lg shadow-sky-500/10"
                      : "border-transparent text-white/40 hover:bg-white/4 hover:text-white/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "posts" && (
            <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Posts
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/40">
                Community posts will be displayed here.
              </p>
            </div>
          )}

          {activeTab === "members" && (
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
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
