import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileQuestion,
  Wallet,
  BarChart3,
  Video,
  Star,
  Settings,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import type { NavItem } from "@/components/dashboard/DashboardSidebar";

export const Route = createFileRoute("/instructor")({
  component: InstructorLayout,
  beforeLoad: ({ location }) => {
    // Exact layout URL has no page — send users to the dashboard
    if (location.pathname === "/instructor" || location.pathname === "/instructor/") {
      throw redirect({ to: "/instructor/dashboard" });
    }
  },
});

const items: NavItem[] = [
  { label: "Dashboard", to: "/instructor/dashboard", icon: LayoutDashboard },
  { label: "My Courses", to: "/instructor/courses", icon: BookOpen },
  { label: "Students", to: "/instructor/students", icon: Users },
  { label: "Quizzes", to: "/instructor/quizzes", icon: FileQuestion },
  { label: "Live Sessions", to: "/instructor/live", icon: Video },
  { label: "Earnings", to: "/instructor/earnings", icon: Wallet },
  { label: "Analytics", to: "/instructor/analytics", icon: BarChart3 },
  { label: "Reviews", to: "/instructor/reviews", icon: Star },
  { label: "Settings", to: "/instructor/settings", icon: Settings },
];

function InstructorLayout() {
  return (
    <DashboardLayout items={items} user={{ name: "Sarah Lin", role: "instructor" }} />
  );
}
