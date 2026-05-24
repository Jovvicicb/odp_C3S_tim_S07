import { useParams } from "react-router-dom";
import { ActionButton } from "../../components/ui/ActionButton";
import { Empty, PageHeader } from "../../components/ui/UI";
import { EditPostForm } from "../../components/posts/form/edit/EditPostForm";

export default function EditPostPage() {
  const { id } = useParams();

  const postId = Number(id);

  if (Number.isNaN(postId)) {
    return <Empty message="Invalid post id." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Edit Post"
        title="Update post"
        action={<ActionButton variant="back" label="Back" />}
      />

      <section className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-6 shadow-xl shadow-sky-950/10">
        <EditPostForm postId={postId} />
      </section>
    </div>
  );
}
