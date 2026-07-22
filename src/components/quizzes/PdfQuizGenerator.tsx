import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { generateQuizFromPdf, getCourses, myEnrollments } from "@/lib/api/lms";

type Props = {
  /** student | instructor */
  mode: "student" | "instructor";
  onCreated?: (quiz: any) => void;
};

export default function PdfQuizGenerator({ mode, onCreated }: Props) {
  const [courses, setCourses] = useState<any[]>([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [count, setCount] = useState(5);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        if (mode === "instructor") {
          const res = await getCourses({ instructor: "me", limit: 50 });
          setCourses(res.data || []);
        } else {
          const res = await myEnrollments();
          setCourses(
            (res.data || [])
              .map((e: any) => e.course)
              .filter(Boolean),
          );
        }
      } catch {
        setCourses([]);
      }
    })();
  }, [mode]);

  const run = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error("Choose a PDF");
    if (!courseId) return toast.error("Select a course");
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("courseId", courseId);
      form.append("title", title || `AI Quiz · ${file.name}`);
      form.append("count", String(count));
      const res = await generateQuizFromPdf(form);
      toast.success("Quiz generated from PDF");
      onCreated?.(res.data);
      if (fileRef.current) fileRef.current.value = "";
      setTitle("");
    } catch (e: any) {
      toast.error(e?.message || "Generation failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">
          Generate quiz from PDF {mode === "student" ? "(your enrolled courses)" : ""}
        </h3>
      </div>
      <select
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
      >
        <option value="">Select course…</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz title (optional)"
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
      />
      <div className="flex gap-3 items-center">
        <input
          type="number"
          min={1}
          max={8}
          value={count}
          onChange={(e) => setCount(Math.min(8, Math.max(1, Number(e.target.value) || 5)))}
          className="w-24 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
        <span className="text-xs text-zinc-500">questions (max 8 on free credits)</span>
      </div>
      <input ref={fileRef} type="file" accept="application/pdf" className="block w-full text-sm text-zinc-400" />
      <button
        type="button"
        disabled={busy}
        onClick={() => void run()}
        className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        Generate with AI
      </button>
    </div>
  );
}
