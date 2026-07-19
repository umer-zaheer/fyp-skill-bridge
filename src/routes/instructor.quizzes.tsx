import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Plus,
  FileQuestion,
  X,
  Pencil,
  BarChart2,
  Trash2,
  MoreHorizontal,
  Wand2,
  Upload,
  Eye,
  EyeOff,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { instructorQuizzes as seedQuizzes } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import PdfQuizWizard from "@/components/instructor/PdfQuizWizard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/instructor/quizzes")({
  component: InstructorQuizzesPage,
});

type QuizStatus = "Published" | "Draft";
type Quiz = {
  id: string;
  title: string;
  course: string;
  questions: number;
  attempts: number;
  avgScore: number;
  passRate: number;
  status: QuizStatus;
  sourceFile?: string;
};

type StatusFilter = "All" | QuizStatus;

const statusStyles: Record<string, string> = {
  Published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const COURSES = [
  "Advanced TypeScript",
  "TypeScript Generics Masterclass",
  "Node.js Production Patterns",
  "Full-Stack Testing Guide",
];

function InstructorQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() =>
    seedQuizzes.map((q) => ({ ...q })),
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");

  const [wizardOpen, setWizardOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const [statsQuiz, setStatsQuiz] = useState<Quiz | null>(null);
  const [deleteQuiz, setDeleteQuiz] = useState<Quiz | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [manualTitle, setManualTitle] = useState("");
  const [manualCourse, setManualCourse] = useState(COURSES[0]);
  const [manualCount, setManualCount] = useState(10);
  const [manualSaving, setManualSaving] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      const s = query.toLowerCase();
      const matchesQuery =
        !s || q.title.toLowerCase().includes(s) || q.course.toLowerCase().includes(s);
      const matchesStatus = status === "All" || q.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [quizzes, query, status]);

  const stats = {
    total: quizzes.length,
    published: quizzes.filter((q) => q.status === "Published").length,
    attempts: quizzes.reduce((s, q) => s + q.attempts, 0),
    avgPass: Math.round(
      quizzes.filter((q) => q.attempts > 0).reduce((s, q) => s + q.passRate, 0) /
        Math.max(1, quizzes.filter((q) => q.attempts > 0).length),
    ),
  };

  const openEdit = (q: Quiz) => {
    setEditQuiz(q);
    setEditTitle(q.title);
    setEditCourse(q.course);
  };

  const saveManual = async () => {
    if (!manualTitle.trim()) {
      toast.error("Enter a quiz title");
      return;
    }
    setManualSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    const created: Quiz = {
      id: `iq-${Date.now()}`,
      title: manualTitle.trim(),
      course: manualCourse,
      questions: manualCount,
      attempts: 0,
      avgScore: 0,
      passRate: 0,
      status: "Draft",
    };
    setQuizzes((prev) => [created, ...prev]);
    setManualSaving(false);
    setManualOpen(false);
    setManualTitle("");
    toast.success("Draft quiz created", { description: created.title });
  };

  const saveEdit = async () => {
    if (!editQuiz || !editTitle.trim()) return;
    setEditSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === editQuiz.id ? { ...q, title: editTitle.trim(), course: editCourse } : q,
      ),
    );
    setEditSaving(false);
    setEditQuiz(null);
    toast.success("Quiz updated");
  };

  const togglePublish = async (q: Quiz) => {
    setBusyId(q.id);
    await new Promise((r) => setTimeout(r, 450));
    const next: QuizStatus = q.status === "Published" ? "Draft" : "Published";
    setQuizzes((prev) => prev.map((x) => (x.id === q.id ? { ...x, status: next } : x)));
    setBusyId(null);
    toast.success(next === "Published" ? "Quiz published" : "Moved to draft", {
      description: q.title,
    });
  };

  const confirmDelete = async () => {
    if (!deleteQuiz) return;
    const id = deleteQuiz.id;
    setBusyId(id);
    await new Promise((r) => setTimeout(r, 400));
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    setDeleteQuiz(null);
    setBusyId(null);
    toast.success("Quiz deleted");
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-16 -left-10 h-56 w-56 bg-violet-500/10 rounded-full blur-[90px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Assessments</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              Quizzes &{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                exams
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Upload a PDF to auto-generate quizzes, or create one manually.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setWizardOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
            >
              <Upload className="h-4 w-4" />
              Generate from PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setManualTitle("");
                setManualCourse(COURSES[0]);
                setManualCount(10);
                setManualOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 hover:border-amber-500/40 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-900 dark:text-white transition-colors"
            >
              <Plus className="h-4 w-4 text-amber-500" />
              Manual quiz
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Feature callout */}
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        whileHover={{ y: -2 }}
        onClick={() => setWizardOpen(true)}
        className="w-full text-left rounded-2xl border border-dashed border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/50 p-5 transition-all group"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <Wand2 className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-amber-300 transition-colors">
              AI quiz from PDF
            </p>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Drop lecture notes or slides — we extract content and generate MCQ / True-False questions.
              Frontend is fully wired; backend endpoint will plug in when ready.
            </p>
          </div>
          <span className="text-xs text-amber-400 shrink-0 mt-1 group-hover:translate-x-1 transition-transform">
            Try it →
          </span>
        </div>
      </motion.button>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total quizzes", value: stats.total },
          { label: "Published", value: stats.published },
          { label: "Attempts", value: stats.attempts.toLocaleString() },
          { label: "Avg pass rate", value: `${stats.avgPass || 0}%` },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileHover={{ y: -2, borderColor: "rgba(212,175,55,0.3)" }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-4 transition-colors"
          >
            <p className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
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
              placeholder="Search quizzes…"
              className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["All", "Published", "Draft"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                  status === s
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30 scale-105"
                    : "text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-600",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr className="border-b border-zinc-800/80">
                <th className="text-left font-medium px-5 py-3">Quiz</th>
                <th className="text-left font-medium px-5 py-3">Course</th>
                <th className="text-left font-medium px-5 py-3">Questions</th>
                <th className="text-left font-medium px-5 py-3">Attempts</th>
                <th className="text-left font-medium px-5 py-3">Avg score</th>
                <th className="text-left font-medium px-5 py-3">Pass rate</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-right font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              <AnimatePresence mode="popLayout">
                {filtered.map((q, i) => (
                  <motion.tr
                    key={q.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.02 }}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform">
                          <FileQuestion className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <span className="font-medium text-white group-hover:text-amber-200 transition-colors">
                            {q.title}
                          </span>
                          {q.sourceFile && (
                            <p className="text-[11px] text-zinc-600 mt-0.5 truncate max-w-[200px]">
                              from {q.sourceFile}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-zinc-400">{q.course}</td>
                    <td className="px-5 py-3 text-zinc-400">{q.questions}</td>
                    <td className="px-5 py-3 text-zinc-400">{q.attempts.toLocaleString()}</td>
                    <td className="px-5 py-3 text-white">{q.avgScore ? `${q.avgScore}%` : "—"}</td>
                    <td className="px-5 py-3">
                      {q.passRate ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 rounded-full bg-zinc-800 overflow-hidden">
                            <motion.div
                              className="h-full bg-amber-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${q.passRate}%` }}
                              transition={{ delay: 0.2 + i * 0.03, duration: 0.5 }}
                            />
                          </div>
                          <span className="text-xs text-zinc-400">{q.passRate}%</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex text-xs font-medium px-2 py-1 rounded-full border",
                          statusStyles[q.status],
                        )}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          title="Edit"
                          onClick={() => openEdit(q)}
                          className="p-1.5 rounded-md text-zinc-500 hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          title="Stats"
                          onClick={() => setStatsQuiz(q)}
                          className="p-1.5 rounded-md text-zinc-500 hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                        >
                          <BarChart2 className="h-4 w-4" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1.5 rounded-md text-zinc-500 hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors outline-none">
                            {busyId === q.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 bg-zinc-900 border-zinc-800 text-zinc-200"
                          >
                            <DropdownMenuItem
                              className="focus:bg-white/5 focus:text-amber-400 cursor-pointer"
                              onClick={() => openEdit(q)}
                            >
                              <Pencil className="h-3.5 w-3.5 mr-2" /> Edit details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="focus:bg-white/5 focus:text-amber-400 cursor-pointer"
                              onClick={() => setStatsQuiz(q)}
                            >
                              <BarChart2 className="h-3.5 w-3.5 mr-2" /> View stats
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="focus:bg-white/5 focus:text-amber-400 cursor-pointer"
                              onClick={() => togglePublish(q)}
                            >
                              {q.status === "Published" ? (
                                <>
                                  <EyeOff className="h-3.5 w-3.5 mr-2" /> Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3.5 w-3.5 mr-2" /> Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem
                              className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
                              onClick={() => setDeleteQuiz(q)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <FileQuestion className="h-10 w-10 mx-auto text-zinc-700 mb-3" />
                    <p className="text-zinc-500 text-sm">No quizzes match your filters.</p>
                    <button
                      onClick={() => setWizardOpen(true)}
                      className="mt-3 text-xs text-amber-400 hover:text-amber-300"
                    >
                      Generate one from PDF →
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PdfQuizWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSaved={(q) => {
          setQuizzes((prev) => [
            {
              id: q.id,
              title: q.title,
              course: q.course,
              questions: q.questions,
              attempts: 0,
              avgScore: 0,
              passRate: 0,
              status: q.status,
              sourceFile: q.sourceFile,
            },
            ...prev,
          ]);
        }}
      />

      {/* Manual create modal */}
      <AnimatePresence>
        {manualOpen && (
          <ModalShell onClose={() => setManualOpen(false)} title="Create quiz manually">
            <div className="space-y-4">
              <Field label="Title">
                <input
                  autoFocus
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Quiz title"
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
              <Field label="Course">
                <select
                  value={manualCourse}
                  onChange={(e) => setManualCourse(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  {COURSES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label={`Questions (${manualCount})`}>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={manualCount}
                  onChange={(e) => setManualCount(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </Field>
              <button
                onClick={saveManual}
                disabled={manualSaving}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 py-2.5 text-sm font-semibold text-zinc-950 transition-colors disabled:opacity-50"
              >
                {manualSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Create draft
              </button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editQuiz && (
          <ModalShell onClose={() => setEditQuiz(null)} title="Edit quiz">
            <div className="space-y-4">
              <Field label="Title">
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
              <Field label="Course">
                <select
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  {COURSES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <button
                onClick={saveEdit}
                disabled={editSaving}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 py-2.5 text-sm font-semibold text-zinc-950 transition-colors disabled:opacity-50"
              >
                {editSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Save changes
              </button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* Stats modal */}
      <AnimatePresence>
        {statsQuiz && (
          <ModalShell onClose={() => setStatsQuiz(null)} title="Quiz performance">
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">
                <span className="text-white font-medium">{statsQuiz.title}</span>
                <br />
                {statsQuiz.course}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Questions", value: statsQuiz.questions },
                  { label: "Attempts", value: statsQuiz.attempts.toLocaleString() },
                  { label: "Avg score", value: statsQuiz.avgScore ? `${statsQuiz.avgScore}%` : "—" },
                  { label: "Pass rate", value: statsQuiz.passRate ? `${statsQuiz.passRate}%` : "—" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">{s.label}</p>
                    <p className="mt-1 text-xl font-semibold text-zinc-900 dark:text-white">{s.value}</p>
                  </div>
                ))}
              </div>
              {statsQuiz.passRate > 0 && (
                <div>
                  <p className="text-xs text-zinc-500 mb-2">Pass rate</p>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${statsQuiz.passRate}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              )}
              <button
                onClick={() => setStatsQuiz(null)}
                className="w-full rounded-lg border border-zinc-700 hover:border-zinc-500 py-2.5 text-sm text-zinc-300 transition-colors"
              >
                Close
              </button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteQuiz && (
          <ModalShell onClose={() => setDeleteQuiz(null)} title="Delete quiz?">
            <p className="text-sm text-zinc-400 mb-5">
              <span className="text-white font-medium">{deleteQuiz.title}</span> will be permanently
              removed. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteQuiz(null)}
                className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm text-zinc-300 hover:border-zinc-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={busyId === deleteQuiz.id}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 py-2.5 text-sm font-semibold text-red-400 transition-colors disabled:opacity-50"
              >
                {busyId === deleteQuiz.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-zinc-500">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white font-serif">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
