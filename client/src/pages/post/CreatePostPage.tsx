import PostForm from "../../components/post/PostForm";
import { ActionButton } from "../../components/ui/ActionButton";
import { PageHeader } from "../../components/ui/UI";

export default function CreatePostPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Posts"
        title="Create post"
        action={<ActionButton variant="back" label="Back" />}
      />

      <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <PostForm />
      </div>
    </div>
  );
}
