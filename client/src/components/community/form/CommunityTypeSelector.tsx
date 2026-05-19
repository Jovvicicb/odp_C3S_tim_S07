import type { CommunityType } from "../../../types/community/CommunityType";

type Props = {
  value: CommunityType;
  onChange: (value: CommunityType) => void;
};

export function CommunityTypeSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-white/35">
        Community type
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange("public")}
          className={`rounded-2xl border px-5 py-4 text-left transition-all ${
            value === "public"
              ? "border-sky-300/30 bg-sky-400/10 shadow-lg shadow-sky-500/10"
              : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              value === "public" ? "text-sky-100" : "text-white/70"
            }`}
          >
            Public
          </p>

          <p className="mt-1 text-xs leading-5 text-white/35">
            Anyone can discover and view this community.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onChange("private")}
          className={`rounded-2xl border px-5 py-4 text-left transition-all ${
            value === "private"
              ? "border-sky-300/30 bg-sky-400/10 shadow-lg shadow-sky-500/10"
              : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6"
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              value === "private" ? "text-sky-100" : "text-white/70"
            }`}
          >
            Private
          </p>

          <p className="mt-1 text-xs leading-5 text-white/35">
            Users must be approved before joining this community.
          </p>
        </button>
      </div>
    </div>
  );
}
