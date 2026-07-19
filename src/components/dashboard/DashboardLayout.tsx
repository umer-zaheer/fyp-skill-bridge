import { useState, type ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { motion } from "framer-motion";
import DashboardSidebar, { type NavItem } from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Props = {
  items: NavItem[];
  user: { name: string; role: string };
  children?: ReactNode;
};

export default function DashboardLayout({ items, user, children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-amber-500/30 selection:text-amber-700 dark:selection:text-amber-200"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <motion.div
        key="desktop-sidebar"
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="hidden md:block overflow-hidden shrink-0 h-screen"
      >
        <DashboardSidebar
          items={items}
          user={user}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </motion.div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-64 border-0 bg-white dark:bg-zinc-900 h-full overflow-hidden"
        >
          <DashboardSidebar items={items} user={user} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DashboardTopbar
          onMenuClick={() => setMobileOpen(true)}
          onToggleDesktop={() => setCollapsed((c) => !c)}
          desktopHidden={collapsed}
          user={user}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-50 dark:bg-zinc-950">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
