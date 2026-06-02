import type { ReactNode } from "react";

import { Layout } from "../layout/Layout";
import { Spinner } from "../ui/UI";
import { useAuth } from "../../hooks/auth/useAuthHook";

type Props = {
  children: ReactNode;
};

export function PublicLayoutRoute({ children }: Props) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111f]">
        <div className="absolute left-[-10%] top-[-10%] h-105 w-105 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-105 w-105 rounded-full bg-indigo-500/10 blur-3xl" />

        <Spinner size={24} />
      </div>
    );
  }

  return <Layout>{children}</Layout>;
}
