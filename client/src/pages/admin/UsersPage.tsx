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
    <div>
      <PageHeader eyebrow="Admin" title="Users" />

      {error && <ErrorBox message={error} />}

      {loading ? (
        <div className="py-20 flex justify-center">
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
                  className="border-t border-white/4 hover:bg-white/2 transition-colors"
                >
                  <td className="px-5 py-3.5 text-white/30 font-mono text-xs">
                    {u.id}
                  </td>

                  <td className="px-5 py-3.5 text-white/80 text-sm">
                    {u.username}
                  </td>

                  <td className="px-5 py-3.5 text-white/40 text-sm">
                    {u.email}
                  </td>

                  <td className="px-5 py-3.5">
                    <RoleBadge role={u.role} />
                  </td>

                  <td className="px-5 py-3.5 text-white/30 text-xs">
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
