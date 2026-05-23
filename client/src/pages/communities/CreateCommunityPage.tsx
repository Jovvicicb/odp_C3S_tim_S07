import CreateCommunityForm from "../../components/communities/form/CreateCommunityForm";
import { CommunityFormIntro } from "../../components/communities/form/CommunityFormIntro";
import { ActionButton } from "../../components/ui/ActionButton";
import { PageHeader } from "../../components/ui/UI";

export default function CreateCommunityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communities"
        title="Create community"
        action={<ActionButton variant="back" label="Back" />}
      />

      <CommunityFormIntro />

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <CreateCommunityForm />
      </div>
    </div>
  );
}
