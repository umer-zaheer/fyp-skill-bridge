import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Mail, AlertTriangle, CheckCircle2, Filter } from "lucide-react";
import { instructorStudents } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/instructor/students")({
  component: InstructorStudentsPage,
});

type StatusFilter = "All" | "Active" | "Completed" | "At risk";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Completed: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "At risk": "bg-red-500/10 text-red-400 border-red-500/20",
};

function InstructorStudentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [course, setCourse] = useState("All");

  const courses = ["All", ...Array.from(new Set(instructorStudents.map((s) => s.course)))];

  const filtered = useMemo(() => {
    return instructorStudents.filter((s) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchesStatus = status === "All" || s.status === status;
      const matchesCourse = course === "All" || s.course === course;
      return matchesQuery && matchesStatus && matchesCourse;
    });
  }, [query, status, course]);

  const stats = {
    total: instructorStudents.length,
    active: instructorStudents.filter((s) => s.status === "Active").length,
    completed: instructorStudents.filter((s) => s.status === "Completed").length,
    atRisk: instructorStudents.filter((s) => s.status === "At risk").length,
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-20 -right-10 h-56 w-56 bg-amber-500/10 rounded-full blur-[90px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Learners</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              Your{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                students
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Track progress, reach out, and support at-risk learners.</p>
          </div>
          <button className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-700 hover:border-amber-500/40 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-900 dark:text-white transition-colors">
            <Mail className="h-4 w-4 text-amber-500" />
            Message all
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrolled", value: stats.total, icon: Users },
          { label: "Active", value: stats.active, icon: CheckCircle2 },
          { label: "Completed", value: stats.completed, icon: CheckCircle2 },
          { label: "At risk", value: stats.atRisk, icon: AlertTriangle },
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
              <s.icon className={cn("h-4 w-4", s.label === "At risk" ? "text-red-400" : "text-amber-500")} />
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none overflow-hidden">
        <div className="p-4 md:p-5 border-b border-zinc-800/80 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students…"
              className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            {(["All", "Active", "Completed", "At risk"] as StatusFilter[]).map((s) => (
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
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All courses" : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr className="border-b border-zinc-800/80">
                <th className="text-left font-medium px-5 py-3">Student</th>
                <th className="text-left font-medium px-5 py-3">Course</th>
                <th className="text-left font-medium px-5 py-3">Progress</th>
                <th className="text-left font-medium px-5 py-3">Enrolled</th>
                <th className="text-left font-medium px-5 py-3">Last active</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-right font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-semibold text-zinc-900">
                        {s.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{s.name}</p>
                        <p className="text-xs text-zinc-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-400 max-w-[180px] truncate">{s.course}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            s.progress >= 80 ? "bg-emerald-500" : s.progress < 25 ? "bg-red-500" : "bg-amber-500",
                          )}
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400 w-8">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-500">{s.enrolled}</td>
                  <td className="px-5 py-3 text-zinc-500">{s.lastActive}</td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full border", statusStyles[s.status])}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="p-1.5 rounded-md text-zinc-500 hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                      <Mail className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
                    No students match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
