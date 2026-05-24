import { SectionLabel } from "../../ui/SectionLabel";

type Props = {
  username: string;
  onUsernameChange: (value: string) => void;
};

export function SearchUsersToolbar({ username, onUsernameChange }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 px-6 py-5">
        <SectionLabel label="Search" tone="sky" />

        <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
          Find people on PulseNet
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
          Search by username and open profiles to follow users or view their
          public activity.
        </p>
      </div>

      <div className="p-6">
        <label htmlFor="user-search" className="block">
          <SectionLabel label="Username" tone="muted" />
        </label>

        <input
          id="user-search"
          name="user-search"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Search by username..."
          autoComplete="off"
          className="w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20 hover:border-sky-300/20 focus:border-sky-300/40 focus:shadow-lg focus:shadow-sky-500/5"
        />
      </div>
    </section>
  );
}
