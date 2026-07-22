import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { getQuiz, submitQuiz } from "@/lib/api/lms";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/quizzes/$id")({ component: QuizPage });

function QuizPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getQuiz(id);
        setQuiz(res.data);
      } catch (e: any) {
        toast.error(e?.message || "Quiz not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const payload = (quiz.questions || []).map((q: any) => ({
        questionId: q._id,
        selectedIndex: answers[q._id] ?? -1,
      }));
      const res = await submitQuiz(id, payload);
      setResult(res.data);
      toast.success(`Score: ${res.data.score}%`);
    } catch (e: any) {
      toast.error(e?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <p className="text-zinc-400">
        Quiz unavailable. <Link to="/student/quizzes" className="text-amber-400">Back</Link>
      </p>
    );
  }

  if (result) {
    return (
      <div className="max-w-lg mx-auto rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-8 text-center space-y-4">
        <h2 className="text-2xl font-serif text-white">Quiz complete</h2>
        <p className="text-4xl font-semibold text-amber-400">{result.score}%</p>
        <p className="text-sm text-zinc-400">
          {result.correct}/{result.total} correct ·{" "}
          {result.passed ? "Passed" : "Not passed"}
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            to="/student/quizzes"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm"
          >
            Back to quizzes
          </Link>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950"
          >
            Retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <button
          type="button"
          onClick={() => navigate({ to: "/student/quizzes" })}
          className="text-xs text-zinc-500 hover:text-amber-400"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-serif text-white mt-2">{quiz.title}</h1>
        <p className="text-sm text-zinc-400">{quiz.course?.title}</p>
      </div>

      <div className="space-y-4">
        {(quiz.questions || []).map((q: any, i: number) => (
          <div key={q._id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-sm font-medium text-white mb-3">
              {i + 1}. {q.prompt}
            </p>
            <div className="space-y-2">
              {(q.options || []).map((opt: string, oi: number) => (
                <button
                  key={oi}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [q._id]: oi }))}
                  className={cn(
                    "w-full text-left rounded-lg border px-3 py-2 text-sm transition-colors",
                    answers[q._id] === oi
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-200"
                      : "border-zinc-800 text-zinc-300 hover:border-zinc-600",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={() => void submit()}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-50"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit answers
      </button>
    </div>
  );
}
