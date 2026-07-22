import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import type { NavItem } from "@/components/dashboard/DashboardSidebar";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const items: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Courses", to: "/admin/courses", icon: BookOpen },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Moderation", to: "/admin/moderation", icon: ShieldCheck },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

function AdminLayout() {
  const { user } = useAuth();

  return (
    <RequireAuth roles={["admin"]}>
      <DashboardLayout
        items={items}
        user={{
          name: user?.name || "Admin",
          role: user?.role || "admin",
          avatar: user?.avatar?.url,
        }}
      />
    </RequireAuth>
  );
}
