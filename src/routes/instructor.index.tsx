import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/instructor/")({
  component: InstructorIndexRedirect,
});

function InstructorIndexRedirect() {
  return <Navigate to="/instructor/dashboard" replace />;
}
