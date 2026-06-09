import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, GraduationCap, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

type Props = {
  items: NavItem[];
  user: { name: string; role: string; avatar?: string };
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function DashboardSidebar({ items, user, collapsed = false, onToggle }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      style={{ fontFamily: "Inter, sans-serif" }}
      className={cn(
        "relative flex h-full flex-col text-zinc-300 bg-zinc-900 border-r border-zinc-800/80 transition-[width] duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-zinc-800/80">
        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <GraduationCap className="w-5 h-5 text-amber-500" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-white font-serif">
            Skill Bridge.
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                    active
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent",
                    collapsed && "justify-center px-0",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn("h-5 w-5 shrink-0 transition-colors", active && "text-amber-500")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {onToggle && (
        <button
          onClick={onToggle}
          className="mx-3 my-2 hidden md:flex items-center justify-center rounded-lg py-2 text-zinc-500 hover:bg-white/5 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      )}

      <div
        className={cn(
          "border-t border-zinc-800/80 p-3 flex items-center gap-3",
          collapsed && "justify-center",
        )}
      >
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-semibold text-zinc-900">
          {user.name.charAt(0)}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-amber-500/80 capitalize">{user.role}</p>
            </div>
            <button className="text-zinc-500 hover:text-amber-400 transition-colors" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
