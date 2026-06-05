import { useParams } from "react-router-dom";

import { ActionButton } from "../../components/ui/button/ActionButton";
import { PageHeader } from "../../components/ui/layout/PageHeader";
import { IntroPanel } from "../../components/ui/panel/IntroPanel";
import { SectionEmptyState } from "../../components/ui/empty/SectionEmptyState";

import { EditPostForm } from "../../components/posts/form/edit/EditPostForm";

export default function EditPostPage() {
  const { id } = useParams();

  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Posts"
          title="Invalid post"
          action={<ActionButton variant="back" label="Back" />}
        />

        <SectionEmptyState
          title="Invalid post id."
          description="The post you are trying to edit has an invalid identifier."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Posts"
        title="Edit post"
        action={<ActionButton variant="back" label="Back" />}
      />

      <IntroPanel
        label="Edit post"
        title="Update post details"
        description="Adjust the title, content or image for this post. Only save the changes you want to apply."
      />

      <section className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <EditPostForm postId={postId} />
      </section>
    </div>
  );
}
