import {
  PageHeader,
  Table,
  TableHead,
  RoleBadge,
  Empty,
  ErrorBox,
  Spinner,
  Pagination,
} from "../../components/ui/UI";
import { useUsers } from "../../hooks/users/useUsers";

export default function UsersPage() {
  const { users, loading, error, page, limit, total, setPage } = useUsers(
    1,
    10,
  );

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin panel" title="Users" />

      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      ) : users.length === 0 && !error ? (
        <Empty message="No users found" />
      ) : (
        <>
          <Table>
            <TableHead
              columns={["ID", "Username", "Email", "Role", "Status"]}
            />

            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-white/6 transition-colors hover:bg-sky-400/5"
                >
                  <td className="px-5 py-4 font-mono text-xs text-white/30">
                    #{u.id}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-white/85">
                    {u.username}
                  </td>

                  <td className="px-5 py-4 text-sm text-white/45">{u.email}</td>

                  <td className="px-5 py-4">
                    <RoleBadge role={u.role} />
                  </td>

                  <td className="px-5 py-4 text-xs font-medium text-white/35">
                    {u.isActive ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            page={page}
            total={total}
            pageSize={limit}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
