import { NavLink, useLocation } from "react-router-dom";

type SidebarItem = {
  to: string;
  label: string;
};

type Props = {
  title: string;
  items: SidebarItem[];
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
};

export function SidebarGroup({
  title,
  items,
  open,
  onToggle,
  onNavigate,
}: Props) {
  const location = useLocation();

  const isItemActive = (to: string) => {
    if (to === "/communities") {
      return location.pathname === "/communities";
    }

    if (to === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const hasActiveItem = items.some((item) => isItemActive(item.to));
  const isOpen = open || hasActiveItem;

  return (
    <div className="rounded-2xl">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          hasActiveItem
            ? "bg-sky-400/10 text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.08)] ring-1 ring-sky-300/15"
            : "text-white/55 hover:bg-white/4 hover:text-white"
        }`}
      >
        <span>{title}</span>

        <span
          className={`text-base leading-none transition-transform duration-200 ${
            isOpen ? "rotate-90 text-sky-200" : "text-white/30"
          }`}
        >
          ›
        </span>
      </button>

      <div
        className={`grid transition-all duration-200 ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="ml-4 mt-2 space-y-1 border-l border-white/10 pl-3">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                className={() => {
                  const active = isItemActive(item.to);

                  return `relative block rounded-xl px-4 py-2.5 text-sm transition-all duration-200 ${
                    active
                      ? "bg-white/6 text-sky-100"
                      : "text-white/40 hover:bg-white/4 hover:text-white/80"
                  }`;
                }}
              >
                {isItemActive(item.to) && (
                  <span className="absolute -left-3.25 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.8)]" />
                )}

                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
