import { Bell, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  onMenuClick: () => void;
  onToggleDesktop?: () => void;
  desktopHidden?: boolean;
  pageTitle?: string;
  user: { name: string; role: string };
};

export default function DashboardTopbar({ onMenuClick, onToggleDesktop, desktopHidden, pageTitle, user }: Props) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { logout } = useAuth();
  const fallbackTitle =
    pageTitle ??
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      ?.replace(/^\w/, (c) => c.toUpperCase()) ??
    "Dashboard";

  const settingsTo =
    user.role === "admin"
      ? ("/admin/settings" as const)
      : user.role === "instructor"
        ? ("/instructor/settings" as const)
        : ("/student/subscription" as const);

  const profileTo =
    user.role === "admin"
      ? ("/admin" as const)
      : user.role === "instructor"
        ? ("/instructor/dashboard" as const)
        : ("/student/dashboard" as const);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    void navigate({ to: "/login" });
  };

  return (
    <header
      className="h-16 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between px-4 md:px-6"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        {onToggleDesktop && (
          <motion.button
            type="button"
            onClick={onToggleDesktop}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="hidden md:flex p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-amber-500/10 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 transition-colors"
            title={desktopHidden ? "Expand sidebar" : "Collapse to icons"}
          >
            {desktopHidden ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </motion.button>
        )}
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">{fallbackTitle}</h1>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Link
          to="/courses"
          className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-amber-600 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-amber-400 transition-colors"
          title="Browse courses"
        >
          <Search className="h-5 w-5" />
        </Link>
        <ThemeToggle />
        <button
          type="button"
          className="relative p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-amber-600 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-amber-400 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900">
            {user.name.charAt(0)}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200"
          >
            <DropdownMenuLabel>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">{user.name}</div>
              <div className="text-xs text-amber-600 dark:text-amber-500/80 capitalize">{user.role}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuItem
              className="focus:bg-zinc-100 focus:text-amber-600 dark:focus:bg-white/5 dark:focus:text-amber-400 cursor-pointer"
              onClick={() => void navigate({ to: profileTo })}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:bg-zinc-100 focus:text-amber-600 dark:focus:bg-white/5 dark:focus:text-amber-400 cursor-pointer"
              onClick={() => void navigate({ to: settingsTo })}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuItem
              className="text-red-500 focus:bg-red-500/10 focus:text-red-600 dark:text-red-400 dark:focus:text-red-300 cursor-pointer"
              onClick={() => void handleLogout()}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
