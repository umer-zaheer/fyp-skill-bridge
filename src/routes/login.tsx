import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/components/auth/AuthProvider";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
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
      title="Welcome back"
      subtitle="Enter your credentials to access your personalized dashboard."
    >
      <LoginForm />
    </AuthLayout>
  );
}
