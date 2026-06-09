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

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const items: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Courses", to: "/admin/courses", icon: BookOpen },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Moderation", to: "/admin/moderation", icon: ShieldCheck },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

function AdminLayout() {
  return <DashboardLayout items={items} user={{ name: "Admin User", role: "admin" }} />;
}
