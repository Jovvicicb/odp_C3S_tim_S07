type Props = {
  name: string;
  imageUrl: string | null;
  initial: string;
};

export function CommunityAvatar({ name, imageUrl, initial }: Props) {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <span className="text-xl font-black text-sky-200/75">{initial}</span>
      )}
    </div>
  );
}
