import { useParams } from "react-router-dom";

import { ActionButton } from "../../components/ui/button/ActionButton";
import { ErrorBox, PageHeader, Spinner } from "../../components/ui/UI";
import { SectionEmptyState } from "../../components/ui/SectionEmptyState";

import { EditCommunityForm } from "../../components/communities/form/edit/EditCommunityForm";

import { useCommunityDetails } from "../../hooks/communities/core/useCommunityDetails";
import { IntroPanel } from "../../components/ui/IntroPanel";

export default function EditCommunityPage() {
  const { id } = useParams();

  const communityId = Number(id);
  const parsedCommunityId = Number.isNaN(communityId) ? null : communityId;

  const { details, loading, error } = useCommunityDetails(
    parsedCommunityId,
    1,
    10,
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Communities"
          title="Community not found"
          action={<ActionButton variant="back" label="Back" />}
        />

        <SectionEmptyState
          title="Community not found."
          description="The community you are trying to edit does not exist or is no longer available."
        />
      </div>
    );
  }

  if (!details.permissions.canUpdateCommunity) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Communities"
          title="Edit community"
          action={
            <ActionButton
              variant="back"
              label="Back"
              to={`/communities/${details.community.id}`}
            />
          }
        />

        <SectionEmptyState
          title="Permission denied."
          description="You do not have permission to edit this community."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communities"
        title="Edit community"
        action={
          <ActionButton
            variant="back"
            label="Back"
            to={`/communities/${details.community.id}`}
          />
        }
      />

      {error && <ErrorBox message={error} />}

      <IntroPanel
        label="Edit community"
        title="Update community details"
        description="Adjust the community name, description, rules, visibility and image. Changes will be visible to members immediately."
      />

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <EditCommunityForm community={details.community} />
      </div>
    </div>
  );
}
