import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/components/auth/AuthProvider";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const { user, isLoading, isAuthenticated, dashboardPath } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      void navigate({ to: dashboardPath(user.role) });
    }
  }, [isLoading, isAuthenticated, user, navigate, dashboardPath]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Create your legacy"
      subtitle="Join Skill Bridge today. Select your path below."
    >
      <SignupForm />
    </AuthLayout>
  );
}
