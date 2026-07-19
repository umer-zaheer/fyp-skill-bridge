import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Check,
  X,
  Flag,
  MessageSquare,
  BookOpen,
  User,
  Filter,
} from "lucide-react";
import { moderationQueue } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/moderation")({ component: AdminModerationPage });

type TypeFilter = "All" | "Review" | "Course" | "Comment" | "Report" | "User";
type Severity = "Low" | "Medium" | "High" | "Critical";

const severityStyles: Record<Severity, string> = {
  Low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Critical: "bg-red-500/10 text-red-400 border-red-500/20",
};

const typeIcons = {
  Review: MessageSquare,
  Course: BookOpen,
  Comment: MessageSquare,
  Report: Flag,
  User: User,
};

function AdminModerationPage() {
  const [type, setType] = useState<TypeFilter>("All");
  const [queue, setQueue] = useState(moderationQueue);
  const [activeId, setActiveId] = useState<string | null>(moderationQueue[0]?.id ?? null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () => queue.filter((m) => type === "All" || m.type === type),
    [queue, type],
  );

  const active = filtered.find((m) => m.id === activeId) ?? filtered[0] ?? null;

  const resolve = (id: string, action: "approve" | "reject") => {
    setQueue((prev) => prev.filter((m) => m.id !== id));
    setToast(action === "approve" ? "Item approved and cleared." : "Item rejected and removed.");
    setTimeout(() => setToast(null), 2200);
  };

  const counts = {
    total: queue.length,
    critical: queue.filter((m) => m.severity === "Critical").length,
    high: queue.filter((m) => m.severity === "High").length,
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -bottom-20 -right-10 h-56 w-56 bg-red-500/10 rounded-full blur-[90px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Trust & safety</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              Content{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                moderation
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Review flagged content, course submissions, and user reports.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-center">
              <p className="text-lg font-semibold text-red-400">{counts.critical}</p>
              <p className="text-[10px] uppercase tracking-wider text-red-400/70">Critical</p>
            </div>
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-center">
              <p className="text-lg font-semibold text-orange-400">{counts.high}</p>
              <p className="text-[10px] uppercase tracking-wider text-orange-400/70">High</p>
            </div>
            <div className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-center">
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">{counts.total}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Queue</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-zinc-500" />
        {(["All", "Review", "Course", "Comment", "Report", "User"] as TypeFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setType(t);
              setActiveId(null);
            }}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
              type === t
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "text-zinc-500 border-zinc-800 hover:text-white",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[420px]">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-zinc-800/80 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Queue</h3>
            <span className="ml-auto text-xs text-zinc-500">{filtered.length} items</span>
          </div>
          <ul className="flex-1 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800/60">
            {filtered.map((m) => {
              const Icon = typeIcons[m.type];
              const selected = active?.id === m.id;
              return (
                <li key={m.id}>
                  <button
                    onClick={() => setActiveId(m.id)}
                    className={cn(
                      "w-full text-left px-4 py-3.5 transition-colors",
                      selected ? "bg-amber-500/10 border-l-2 border-amber-500" : "hover:bg-white/[0.02] border-l-2 border-transparent",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                        <Icon className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{m.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5 truncate">{m.target}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full border", severityStyles[m.severity])}>
                            {m.severity}
                          </span>
                          <span className="text-[10px] text-zinc-600">{m.submitted}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-16 text-center text-zinc-500 text-sm">
                <Check className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                Queue is clear. Nice work.
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5 md:p-6">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-zinc-500">{active.type}</span>
                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full border", severityStyles[active.severity])}>
                      {active.severity}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white font-serif">{active.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Reported by <span className="text-amber-400">{active.author}</span> · {active.submitted}
                  </p>
                </div>
                {(active.severity === "High" || active.severity === "Critical") && (
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50 p-4">
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Target</p>
                <p className="text-sm text-white font-medium">{active.target}</p>
              </div>

              <div className="mt-4 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50 p-4 flex-1">
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Details</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{active.excerpt}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => resolve(active.id, "approve")}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => resolve(active.id, "reject")}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Reject / remove
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 hover:border-zinc-600 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors">
                  Escalate
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
              <ShieldCheck className="h-10 w-10 mb-3 text-emerald-500" />
              <p className="text-sm">Nothing left to review.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 z-50 rounded-lg border border-emerald-500/30 bg-zinc-900 px-4 py-3 text-sm text-emerald-400 shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
