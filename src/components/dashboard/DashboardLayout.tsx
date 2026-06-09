import { useState, type ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
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
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <AnimatePresence initial={false}>
        {!hidden && (
          <motion.div
            key="desktop-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: collapsed ? 64 : 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="hidden md:block overflow-hidden shrink-0"
          >
            <DashboardSidebar
              items={items}
              user={user}
              collapsed={collapsed}
              onToggle={() => setCollapsed((c) => !c)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-0 bg-zinc-900">
          <DashboardSidebar items={items} user={user} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar
          onMenuClick={() => setMobileOpen(true)}
          onToggleDesktop={() => setHidden((h) => !h)}
          desktopHidden={hidden}
          user={user}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-zinc-950">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
