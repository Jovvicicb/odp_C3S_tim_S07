import type { TagDto } from "../../../models/tags/TagDto";

type Props = {
  tag: TagDto;
  deleting: boolean;
  onDelete: () => void;
};

export function AdminTagCard({ tag, deleting, onDelete }: Props) {
  const createdAt = new Date(tag.createdAt).toLocaleDateString();

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-4 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-white/5">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-sky-400/5 blur-3xl transition-all group-hover:bg-sky-400/10" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-base font-bold text-white">
              #{tag.name}
            </p>

            <p className="mt-1 text-xs text-white/25">Created {createdAt}</p>
          </div>

          <span className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/35">
            ID {tag.id}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-white/6 pt-4">
          <span className="text-xs font-medium text-white/30">Global tag</span>

          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 transition-all hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
