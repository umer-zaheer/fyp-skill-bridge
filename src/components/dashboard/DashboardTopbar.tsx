import { Bell, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  onMenuClick: () => void;
  onToggleDesktop?: () => void;
  desktopHidden?: boolean;
  pageTitle?: string;
  user: { name: string; role: string };
};

export default function DashboardTopbar({ onMenuClick, onToggleDesktop, desktopHidden, pageTitle, user }: Props) {
  const [dark, setDark] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fallbackTitle =
    pageTitle ??
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      ?.replace(/^\w/, (c) => c.toUpperCase()) ??
    "Dashboard";

  return (
    <header
      className="h-16 bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between px-4 md:px-6"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        {onToggleDesktop && (
          <motion.button
            onClick={onToggleDesktop}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="hidden md:flex p-2 -ml-2 rounded-lg text-zinc-400 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
            title={desktopHidden ? "Show sidebar" : "Hide sidebar"}
          >
            {desktopHidden ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </motion.button>
        )}
        <h1 className="text-lg font-semibold text-white tracking-tight">{fallbackTitle}</h1>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <button className="p-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-amber-400 transition-colors">
          <Search className="h-5 w-5" />
        </button>
        <button
          onClick={() => setDark((d) => !d)}
          className="p-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-amber-400 transition-colors"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="relative p-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-amber-400 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-1 h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
            {user.name.charAt(0)}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200">
            <DropdownMenuLabel>
              <div className="text-sm font-semibold text-white">{user.name}</div>
              <div className="text-xs text-amber-500/80 capitalize">{user.role}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-white/5 focus:text-amber-400">Profile</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-white/5 focus:text-amber-400">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-300">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
