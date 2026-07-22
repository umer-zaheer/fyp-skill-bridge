import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/lib/api/auth";

type Props = {
  children: React.ReactNode;
  roles?: UserRole[];
};

export default function RequireAuth({ children, roles }: Props) {
  const { user, isLoading, isAuthenticated, dashboardPath } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      void navigate({ to: "/login" });
      return;
    }

    if (roles && user && !roles.includes(user.role)) {
      void navigate({ to: dashboardPath(user.role) });
    }
  }, [isLoading, isAuthenticated, user, roles, navigate, dashboardPath]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (roles && !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
