import type { ReactNode } from "react";

type TableProps = {
  children: ReactNode;
  minWidthClassName?: string;
};

export function Table({
  children,
  minWidthClassName = "min-w-[900px]",
}: TableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#0b0f17]/80 shadow-xl shadow-sky-950/10">
      <div className="overflow-x-auto">
        <table className={`w-full text-sm ${minWidthClassName}`}>
          {children}
        </table>
      </div>
    </div>
  );
}

type TableHeadProps = {
  columns: string[];
};

export function TableHead({ columns }: TableHeadProps) {
  return (
    <thead>
      <tr className="border-b border-white/8 bg-white/3">
        {columns.map((column) => (
          <th
            key={column}
            className="px-5 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-200/35"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

type TableBodyProps = {
  children: ReactNode;
};

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-white/6">{children}</tbody>;
}

type TableRowProps = {
  children: ReactNode;
};

export function TableRow({ children }: TableRowProps) {
  return <tr className="transition-colors hover:bg-white/4">{children}</tr>;
}

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`px-5 py-4 align-top text-sm ${className}`}>{children}</td>
  );
}
