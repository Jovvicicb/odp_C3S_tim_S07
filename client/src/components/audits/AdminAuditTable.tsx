import { AuditDisplayHelper } from "../../helpers/audits/AuditDisplayHelper";

import type { AuditDto } from "../../models/audits/AuditDto";
import type { PaginatedListDto } from "../../models/common/PaginatedListDto";

import { SectionEmptyState } from "../ui/empty/SectionEmptyState";
import { Spinner } from "../ui/spinner/Spinner";
import { Pagination } from "../ui/pagination/Pagination";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table/Table";

type Props = {
  audits: PaginatedListDto<AuditDto>;
  page: number;
  limit: number;
  loading: boolean;
  onPageChange: (page: number) => void;
};

const columns = [
  "ID",
  "Actor",
  "Action",
  "Details",
  "IP address",
  "Created at",
];

export function AdminAuditTable({
  audits,
  page,
  limit,
  loading,
  onPageChange,
}: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={24} />
      </div>
    );
  }

  if (audits.items.length === 0) {
    return (
      <SectionEmptyState
        title="No audit logs found."
        description="System and user activity will appear here once actions are recorded."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Table>
        <TableHead columns={columns} />

        <TableBody>
          {audits.items.map((audit) => (
            <TableRow key={audit.id}>
              <TableCell className="font-semibold text-white/45">
                #{audit.id}
              </TableCell>

              <TableCell>
                <span
                  className={`rounded-2xl border px-3 py-1 text-xs font-semibold ${
                    audit.userId === null
                      ? "border-amber-300/15 bg-amber-400/10 text-amber-200"
                      : "border-sky-300/15 bg-sky-400/10 text-sky-200"
                  }`}
                >
                  {AuditDisplayHelper.actorLabel(audit.userId)}
                </span>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-semibold text-white/75">
                    {AuditDisplayHelper.formatAction(audit.action)}
                  </p>

                  <p className="mt-1 text-[11px] text-white/25">
                    {audit.action}
                  </p>
                </div>
              </TableCell>

              <TableCell className="max-w-105">
                <p className="line-clamp-2 leading-6 text-white/50">
                  {audit.details || "No details provided."}
                </p>
              </TableCell>

              <TableCell className="text-white/45">
                {audit.ipAddress || "Not recorded"}
              </TableCell>

              <TableCell className="whitespace-nowrap text-white/45">
                {AuditDisplayHelper.formatDate(audit.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="border-t border-white/8 pt-5">
        <Pagination
          page={page}
          total={audits.total}
          pageSize={limit}
          onChange={onPageChange}
        />
      </div>
    </div>
  );
}
