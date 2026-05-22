import { useState } from "react";
import { MarkdownContent } from "../../markdown/MarkdownContent";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type EditorMode = "write" | "preview";

export function PostMarkdownEditor({ value, onChange }: Props) {
  const [mode, setMode] = useState<EditorMode>("write");

  const trimmedValue = value.trim();
  const characterLimit = 10000;
  const isNearLimit = value.length >= characterLimit * 0.9;

  return (
    <div>
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="post-content"
          className="block text-xs font-medium uppercase tracking-wider text-white/35"
        >
          Content
        </label>

        <div className="flex w-fit rounded-2xl border border-white/10 bg-white/3 p-1">
          <EditorTab
            label="Write"
            active={mode === "write"}
            onClick={() => setMode("write")}
          />

          <EditorTab
            label="Preview"
            active={mode === "preview"}
            onClick={() => setMode("preview")}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
        {mode === "write" ? (
          <textarea
            id="post-content"
            name="content"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            minLength={10}
            maxLength={characterLimit}
            required
            placeholder="Write your post content in Markdown..."
            className="min-h-64 w-full resize-none border-0 bg-transparent px-4 py-3 text-sm leading-6 text-white outline-none placeholder-white/20 transition-all focus:bg-white/2"
          />
        ) : (
          <div className="min-h-64 px-4 py-4">
            {trimmedValue ? (
              <MarkdownContent content={value} />
            ) : (
              <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 text-center">
                <p className="max-w-md text-sm leading-6 text-white/30">
                  Nothing to preview yet. Write some Markdown content first.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-white/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">
            Markdown is supported: headings, lists, links, quotes, tables and
            code blocks.
          </p>

          <span
            className={`w-fit rounded-xl border px-2.5 py-1 text-[11px] font-semibold ${
              isNearLimit
                ? "border-amber-400/20 bg-amber-500/10 text-amber-200"
                : "border-white/10 bg-white/5 text-white/30"
            }`}
          >
            {value.length}/{characterLimit}
          </span>
        </div>
      </div>
    </div>
  );
}

function EditorTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
        active
          ? "bg-sky-400/10 text-sky-100 shadow-sm shadow-sky-500/10"
          : "text-white/35 hover:bg-white/5 hover:text-white/70"
      }`}
    >
      {label}
    </button>
  );
}
