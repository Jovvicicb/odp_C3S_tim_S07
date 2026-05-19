import { Link } from "react-router-dom";

type Props = {
  text: string;
  linkText: string;
  to: string;
};

export function AuthRedirectBox({ text, linkText, to }: Props) {
  return (
    <div className="mt-7 rounded-2xl border border-white/8 bg-white/3 px-4 py-4">
      <p className="text-center text-sm text-white/35">
        {text}{" "}
        <Link
          to={to}
          className="font-medium text-sky-300 transition-colors hover:text-sky-200"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
}
