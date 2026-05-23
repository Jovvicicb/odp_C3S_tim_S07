type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function PostTitleInput({ value, onChange }: Props) {
  return (
    <div>
      <label
        htmlFor="post-title"
        className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/35"
      >
        Post title
      </label>

      <input
        id="post-title"
        name="title"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        minLength={5}
        maxLength={200}
        required
        placeholder="Enter post title..."
        className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6 focus:shadow-lg focus:shadow-sky-500/5"
      />
    </div>
  );
}
