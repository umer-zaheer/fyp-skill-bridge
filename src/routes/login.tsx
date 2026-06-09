import { createFileRoute } from "@tanstack/react-router";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your personalized dashboard."
    >
      <LoginForm />
    </AuthLayout>
  );
}
