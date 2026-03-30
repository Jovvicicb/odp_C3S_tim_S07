import { PageHeader } from "../../components/ui/UI";
import { useAuth } from "../../hooks/auth/useAuthHook";

// TODO: Replace with your domain-specific user dashboard content
export default function UserDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader eyebrow="Overview" title={`Welcome, ${user?.username}`} />
      <p className="text-white/30 text-sm">Your dashboard content goes here.</p>
    </div>
  );
}
