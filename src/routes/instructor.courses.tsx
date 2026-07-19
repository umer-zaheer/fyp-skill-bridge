import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Star,
  BookOpen,
  Pencil,
  Archive,
  X,
  LayoutGrid,
  List,
  Users,
  Eye,
} from "lucide-react";
import { instructorCourses } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/instructor/courses")({
  component: InstructorCoursesPage,
});

type StatusFilter = "All" | "Published" | "Draft" | "Review";
type ViewMode = "table" | "grid";

const statusStyles: Record<string, string> = {
  Published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  Review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function InstructorCoursesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [view, setView] = useState<ViewMode>("table");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return instructorCourses.filter((c) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || c.title.toLowerCase().includes(q);
      const matchesStatus = status === "All" || c.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const counts = {
    published: instructorCourses.filter((c) => c.status === "Published").length,
    draft: instructorCourses.filter((c) => c.status === "Draft").length,
    review: instructorCourses.filter((c) => c.status === "Review").length,
    students: instructorCourses.reduce((s, c) => s + c.students, 0),
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -bottom-24 -right-10 h-64 w-64 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Your catalog</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              My{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                courses
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Create, publish, and improve your teaching content.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            New course
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Published", value: counts.published, icon: Eye },
          { label: "In review", value: counts.review, icon: BookOpen },
          { label: "Drafts", value: counts.draft, icon: Pencil },
          { label: "Total students", value: counts.students.toLocaleString(), icon: Users },
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

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none overflow-hidden">
        <div className="p-4 md:p-5 border-b border-zinc-800/80 flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your courses…"
              className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Published", "Draft", "Review"] as StatusFilter[]).map((s) => (
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
            <div className="flex rounded-md border border-zinc-800 p-0.5">
              <button
                onClick={() => setView("table")}
                className={cn("p-1.5 rounded", view === "table" ? "bg-amber-500/15 text-amber-400" : "text-zinc-500")}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("grid")}
                className={cn("p-1.5 rounded", view === "grid" ? "bg-amber-500/15 text-amber-400" : "text-zinc-500")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {view === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr className="border-b border-zinc-800/80">
                  <th className="text-left font-medium px-5 py-3">Course</th>
                  <th className="text-left font-medium px-5 py-3">Students</th>
                  <th className="text-left font-medium px-5 py-3">Revenue</th>
                  <th className="text-left font-medium px-5 py-3">Completion</th>
                  <th className="text-left font-medium px-5 py-3">Rating</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                  <th className="text-right font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={c.thumb} alt="" className="h-12 w-16 rounded-md object-cover border border-zinc-800" />
                        <div>
                          <p className="font-medium text-white">{c.title}</p>
                          <p className="text-xs text-zinc-500">{c.lessons} lessons · {usd(c.price)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-zinc-400">{c.students.toLocaleString()}</td>
                    <td className="px-5 py-3 text-amber-400 font-medium">{usd(c.revenue)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-zinc-800 overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${c.completion}%` }} />
                        </div>
                        <span className="text-xs text-zinc-400">{c.completion}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {c.rating > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          {c.rating}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full border", statusStyles[c.status])}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button className="p-1.5 rounded-md text-zinc-500 hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-white/5">
                          <Archive className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 overflow-hidden hover:border-amber-500/30 transition-colors group"
              >
                <div className="relative h-36">
                  <img src={c.thumb} alt="" className="h-full w-full object-cover" />
                  <span className={cn("absolute top-3 left-3 text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full border backdrop-blur-sm", statusStyles[c.status])}>
                    {c.status}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-zinc-900 dark:text-white group-hover:text-amber-300 transition-colors">{c.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{c.students.toLocaleString()} students</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">{c.completion}% done</span>
                    <span className="font-semibold text-amber-400">{usd(c.revenue)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="px-5 py-12 text-center text-zinc-500">No courses match your filters.</p>
        )}
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
              className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white font-serif">Create course</h3>
                <button onClick={() => setCreateOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-zinc-500">Title</label>
                  <input
                    placeholder="Course title"
                    className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-500">Category</label>
                    <select className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none">
                      <option>Development</option>
                      <option>Design</option>
                      <option>Data</option>
                      <option>Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-500">Price (USD)</label>
                    <input
                      type="number"
                      placeholder="49"
                      className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setCreateOpen(false)}
                  className="w-full rounded-lg bg-amber-500 hover:bg-amber-400 py-2.5 text-sm font-semibold text-zinc-950 transition-colors"
                >
                  Save as draft
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
