import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteQuiz, listQuizzes, updateQuiz } from "@/lib/api/lms";
import PdfQuizGenerator from "@/components/quizzes/PdfQuizGenerator";
import { toast } from "sonner";

export const Route = createFileRoute("/instructor/quizzes")({
  component: InstructorQuizzesPage,
});

function InstructorQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const publish = async (id: string, status: string) => {
    try {
      await updateQuiz(id, { status });
      toast.success(status === "published" ? "Published" : "Saved as draft");
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteQuiz(id);
      toast.success("Deleted");
      setQuizzes((q) => q.filter((x) => x._id !== id));
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <div>
        <h2 className="text-3xl font-serif text-white">Quizzes</h2>
        <p className="text-sm text-zinc-400 mt-1">Manage quizzes or generate from PDF via OpenRouter</p>
      </div>

      <PdfQuizGenerator
        mode="instructor"
        onCreated={(quiz) => setQuizzes((prev) => [quiz, ...prev])}
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400 text-left">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Questions</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => (
                <tr key={q._id} className="border-t border-zinc-800">
                  <td className="px-4 py-3 text-white">{q.title}</td>
                  <td className="px-4 py-3">{q.course?.title}</td>
                  <td className="px-4 py-3">{q.questions?.length || 0}</td>
                  <td className="px-4 py-3 capitalize text-amber-400">{q.status}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {q.status !== "published" ? (
                      <button
                        type="button"
                        onClick={() => void publish(q._id, "published")}
                        className="text-xs text-emerald-400"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void publish(q._id, "draft")}
                        className="text-xs text-zinc-400"
                      >
                        Unpublish
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void remove(q._id)}
                      className="text-xs text-red-400 inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {quizzes.length === 0 && (
            <p className="p-6 text-sm text-zinc-500">No quizzes yet — generate from a PDF above.</p>
          )}
        </div>
      )}
    </div>
  );
}
