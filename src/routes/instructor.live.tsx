import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Plus, Users, Clock, X, Calendar, Play } from "lucide-react";
import { instructorLiveSessions } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/instructor/live")({
  component: InstructorLivePage,
});

type StatusFilter = "All" | "Upcoming" | "Completed";

const statusStyles: Record<string, string> = {
  Upcoming: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Completed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

function InstructorLivePage() {
  const [status, setStatus] = useState<StatusFilter>("All");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(
    () => instructorLiveSessions.filter((s) => status === "All" || s.status === status),
    [status],
  );

  const upcoming = instructorLiveSessions.filter((s) => s.status === "Upcoming");
  const next = upcoming[0];

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -bottom-20 -right-10 h-64 w-64 bg-red-500/10 rounded-full blur-[100px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Live teaching</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              Live{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                sessions
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Schedule workshops, office hours, and go live with your class.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            Schedule session
          </button>
        </div>
      </motion.div>

      {next && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-zinc-900/80 to-zinc-900/60 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30">
              <Video className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-500/80">Next up</p>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white font-serif mt-1">{next.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">
                {next.date} · {next.time} · {next.duration} · {next.attendees} registered
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 self-start rounded-lg bg-red-500 hover:bg-red-400 px-5 py-3 text-sm font-semibold text-zinc-900 dark:text-white transition-colors">
            <Play className="h-4 w-4" />
            Start session
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Upcoming", value: upcoming.length, icon: Calendar },
          { label: "Registered seats", value: upcoming.reduce((s, x) => s + x.attendees, 0), icon: Users },
          { label: "Hours scheduled", value: Math.round(upcoming.reduce((s, x) => s + parseInt(x.duration), 0) / 60 * 10) / 10 + "h", icon: Clock },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
              <s.icon className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", "Upcoming", "Completed"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
              status === s
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "text-zinc-500 border-zinc-800 hover:text-white",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5 hover:border-amber-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Video className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-white">{s.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{s.course}</p>
                </div>
              </div>
              <span className={cn("text-[10px] font-medium px-2 py-1 rounded-full border shrink-0", statusStyles[s.status])}>
                {s.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                {s.date} · {s.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                {s.duration}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-amber-500" />
                {s.attendees}/{s.capacity}
              </span>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(s.attendees / s.capacity) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {createOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setCreateOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white font-serif">Schedule session</h3>
                <button onClick={() => setCreateOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500">Title</label>
                  <input
                    placeholder="Session title"
                    className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500">Course</label>
                  <select className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none">
                    <option>Advanced TypeScript</option>
                    <option>TypeScript Generics Masterclass</option>
                    <option>Node.js Production Patterns</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-500">Date</label>
                    <input
                      type="date"
                      className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-500">Time</label>
                    <input
                      type="time"
                      className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setCreateOpen(false)}
                  className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 py-2.5 text-sm font-semibold text-zinc-950 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
