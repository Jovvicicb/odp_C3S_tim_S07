import type { ReactNode } from "react";
import { SectionLabel } from "../label/SectionLabel";

type Props = {
  label: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({
  label,
  title,
  description,
  action,
  children,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="border-b border-white/8 bg-white/2 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionLabel label={label} tone="sky" />

            <h2 className="mt-2 text-xl font-bold tracking-tight text-white">
              {title}
            </h2>

            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                {description}
              </p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
}
