import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, GraduationCap, LogOut, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileRouteTypes } from "@/routeTree.gen";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type NavItem = {
  label: string;
  to: FileRouteTypes["to"];
  icon: LucideIcon;
  /** When true, only exact path match is active (needed for layout roots like /admin). */
  exact?: boolean;
};

type Props = {
  items: NavItem[];
  user: { name: string; role: string; avatar?: string };
  collapsed?: boolean;
  onToggle?: () => void;
};

export default function DashboardSidebar({ items, user, collapsed = false, onToggle }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        style={{ fontFamily: "Inter, sans-serif" }}
        className={cn(
          "relative flex h-full min-h-0 w-full flex-col text-zinc-600 bg-white border-r border-zinc-200 dark:text-zinc-300 dark:bg-zinc-900 dark:border-zinc-800/80",
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-zinc-200 dark:border-zinc-800/80",
            collapsed ? "justify-center px-2" : "gap-3 px-4",
          )}
        >
          <Link
            to="/"
            className={cn(
              "flex items-center min-w-0",
              collapsed ? "justify-center" : "gap-3",
            )}
            title="Skill Bridge home"
          >
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 shrink-0">
              <GraduationCap className="w-5 h-5 text-amber-500" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-serif truncate">
                Skill Bridge.
              </span>
            )}
          </Link>
        </div>

        <nav
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 [scrollbar-width:thin] [scrollbar-color:rgb(212_212_216)_transparent] dark:[scrollbar-color:rgb(63_63_70)_transparent]",
            collapsed ? "px-2" : "px-3",
          )}
        >
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.to || pathname === `${item.to}/`
                : pathname === item.to || pathname.startsWith(`${item.to}/`);

              const link = (
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group",
                    collapsed ? "justify-center h-11 w-11 mx-auto p-0" : "gap-3 px-3 py-2.5",
                    active
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 border border-transparent dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white",
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0 transition-colors", active && "text-amber-500")} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );

              return (
                <li key={item.to}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
                      >
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    link
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "my-2 hidden md:flex shrink-0 items-center justify-center rounded-lg py-2 text-zinc-400 hover:bg-zinc-100 hover:text-amber-600 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-amber-400 transition-colors",
              collapsed ? "mx-2" : "mx-3",
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          </button>
        )}

        <div
          className={cn(
            "shrink-0 border-t border-zinc-200 dark:border-zinc-800/80 p-3 flex items-center",
            collapsed ? "justify-center" : "gap-3",
          )}
        >
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => void navigate({ to: "/login" })}
                  className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-semibold text-zinc-900"
                  title="Logout"
                >
                  {user.name.charAt(0)}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
              >
                {user.name} · Logout
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-semibold text-zinc-900">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">{user.name}</p>
                <p className="truncate text-xs text-amber-600 dark:text-amber-500/80 capitalize">{user.role}</p>
              </div>
              <button
                type="button"
                className="text-zinc-400 hover:text-amber-600 dark:text-zinc-500 dark:hover:text-amber-400 transition-colors"
                title="Logout"
                onClick={() => void navigate({ to: "/login" })}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
