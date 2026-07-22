import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  Award,
  CreditCard,
  Heart,
  Calendar,
  FileQuestion,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import type { NavItem } from "@/components/dashboard/DashboardSidebar";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/components/auth/AuthProvider";

export const Route = createFileRoute("/student")({ component: StudentLayout });

const items: NavItem[] = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Courses", to: "/student/courses", icon: BookOpen },
  { label: "Continue Learning", to: "/student/learn", icon: PlayCircle },
  { label: "Quizzes", to: "/student/quizzes", icon: FileQuestion },
  { label: "Certificates", to: "/student/certificates", icon: Award },
  { label: "Wishlist", to: "/student/wishlist", icon: Heart },
  { label: "Schedule", to: "/student/schedule", icon: Calendar },
  { label: "Subscription", to: "/student/subscription", icon: CreditCard },
];

function StudentLayout() {
  const { user } = useAuth();

  return (
    <RequireAuth roles={["student"]}>
      <DashboardLayout
        items={items}
        user={{
          name: user?.name || "Student",
          role: user?.role || "student",
          avatar: user?.avatar?.url,
        }}
      />
    </RequireAuth>
  );
}
