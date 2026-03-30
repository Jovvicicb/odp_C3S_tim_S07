import { useEffect, useState } from "react";
import { PageHeader, Table, TableHead, RoleBadge, Empty, ErrorBox } from "../../components/ui/UI";
import { usersApi } from "../../api_services/users/UsersAPIService";
import type { UserDto } from "../../models/user/UserTypes";

export default function UsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    usersApi.getAll()
      .then(res => { if (res.success) setUsers(res.data ?? []); else setError(res.message); })
      .catch(() => setError("Failed to load users"));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Users" />
      {error && <ErrorBox message={error} />}
      {users.length === 0 && !error ? <Empty message="No users found" /> : (
        <Table>
          <TableHead columns={["ID", "Username", "Email", "Role", "Status"]} />
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-white/4 hover:bg-white/2 transition-colors">
                <td className="px-5 py-3.5 text-white/30 font-mono text-xs">{u.id}</td>
                <td className="px-5 py-3.5 text-white/80 text-sm">{u.username}</td>
                <td className="px-5 py-3.5 text-white/40 text-sm">{u.email}</td>
                <td className="px-5 py-3.5"><RoleBadge role={u.role} /></td>
                <td className="px-5 py-3.5 text-white/30 text-xs">{u.isActive ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
