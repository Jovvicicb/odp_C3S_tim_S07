import { ActionButton } from "../../components/ui/button/ActionButton";
import { PageHeader } from "../../components/ui/layout/PageHeader";
import { IntroPanel } from "../../components/ui/panel/IntroPanel";

import CreateCommunityForm from "../../components/communities/form/create/CreateCommunityForm";

export default function CreateCommunityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communities"
        title="Create community"
        action={<ActionButton variant="back" label="Back" />}
      />

      <IntroPanel
        label="Create community"
        title="Start a new community"
        description="Create a public or private space, describe its purpose and set clear rules so members know what kind of discussions belong there."
      />

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <CreateCommunityForm />
      </div>
    </div>
  );
}
