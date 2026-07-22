import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileQuestion, Loader2, Play, Search, Sparkles } from "lucide-react";
import { listQuizzes } from "@/lib/api/lms";
import PdfQuizGenerator from "@/components/quizzes/PdfQuizGenerator";

export const Route = createFileRoute("/student/quizzes/")({ component: QuizzesIndex });

function QuizzesIndex() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const res = await listQuizzes();
      setQuizzes(res.data || []);
    } catch {
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      quizzes.filter((x) => {
        if (!q) return true;
        const hay = `${x.title} ${x.course?.title || ""}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      }),
    [quizzes, q],
  );

  return (
    <div className="space-y-8 text-zinc-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-amber-300/80">
            <Sparkles className="h-3 w-3" /> Quizzes
          </div>
          <h1 className="mt-2 text-3xl font-serif text-white">Your quizzes</h1>
          <p className="text-sm text-zinc-400 mt-1">
            From enrolled courses — or generate new ones from a PDF
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search quizzes…"
            className="w-72 pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm"
          />
        </div>
      </div>

      <PdfQuizGenerator mode="student" onCreated={(quiz) => setQuizzes((prev) => [quiz, ...prev])} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((quiz, i) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <FileQuestion className="h-5 w-5 text-amber-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white truncate">{quiz.title}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{quiz.course?.title}</p>
                  <p className="text-xs text-zinc-400 mt-2">
                    {quiz.questions?.length || 0} questions · {quiz.timeLimitMinutes || 30} min ·{" "}
                    {quiz.sourceType === "student_pdf" || quiz.sourceType === "pdf_ai"
                      ? "AI / PDF"
                      : "Course"}
                  </p>
                </div>
              </div>
              <Link
                to="/student/quizzes/$id"
                params={{ id: quiz._id }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-zinc-950"
              >
                <Play className="h-3.5 w-3.5" /> Take quiz
              </Link>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-zinc-500 col-span-full">No quizzes yet for your enrollments.</p>
          )}
        </div>
      )}
    </div>
  );
}
