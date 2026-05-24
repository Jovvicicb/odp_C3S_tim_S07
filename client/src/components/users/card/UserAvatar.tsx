import { ImageHelper } from "../../../helpers/images/ImageHelper";

type Props = {
  username: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizeStyles: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-10 w-10 rounded-xl text-sm",
  md: "h-14 w-14 rounded-2xl text-lg",
  lg: "h-16 w-16 rounded-2xl text-xl",
};

export function UserAvatar({ username, image, size = "md" }: Props) {
  const imageUrl = ImageHelper.getImageUrl(image ?? null);
  const initial = username[0]?.toUpperCase() ?? "U";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-white/5 shadow-lg shadow-sky-950/10 ${sizeStyles[size]}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={username}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <span className="font-black text-sky-200/75">{initial}</span>
      )}
    </div>
  );
}
