type Props = {
  username: string;
  onUsernameChange: (value: string) => void;
};

export function SearchUsersToolbar({ username, onUsernameChange }: Props) {
  return (
    <div className="rounded-3xl border border-white/8 bg-[#0b0f17]/80 p-4 shadow-xl shadow-sky-950/10">
      <label
        htmlFor="user-search"
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-white/25"
      >
        Username
      </label>

      <input
        id="user-search"
        name="user-search"
        type="text"
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="Search by username..."
        autoComplete="off"
        className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-sky-300/40 focus:bg-white/6"
      />
    </div>
  );
}
