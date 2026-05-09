import CommunityForm from "../../components/community/CommunityForm";
import { ActionButton } from "../../components/ui/ActionButton";
import { PageHeader } from "../../components/ui/UI";

export default function CreateCommunity() {
  return (
    <div>
      <PageHeader
        eyebrow="Create Community"
        title={`Create Communiti`}
        action={
          <ActionButton type="back" label="Back" to="/dashboard" size="md" />
        }
      />
      <CommunityForm />
    </div>
  );
}
