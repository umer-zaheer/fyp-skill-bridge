import { createFileRoute } from "@tanstack/react-router";

import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  return (
    <AuthLayout
      title="Create your legacy"
      subtitle="Join Skill Bridge today. Select your path below."
    >
      <SignupForm />
    </AuthLayout>
  );
}
