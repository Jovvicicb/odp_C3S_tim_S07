import CreatePostForm from "../../components/posts/form/create/CreatePostForm";
import { ActionButton } from "../../components/ui/ActionButton";
import { IntroPanel } from "../../components/ui/IntroPanel";
import { PageHeader } from "../../components/ui/UI";

export default function CreatePostPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Posts"
        title="Create post"
        action={<ActionButton variant="back" label="Back" />}
      />

      <IntroPanel
        label="Create post"
        title="Share something with the community"
        description="Write a clear title, use Markdown for the content and optionally attach an image to make your post more engaging."
      />

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <CreatePostForm />
      </div>
    </div>
  );
}
