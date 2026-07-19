import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Trash2,
  RefreshCw,
  Loader2,
  AlertCircle,
  Wand2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  generateQuizFromPdf,
  validatePdfFile,
  formatBytes,
  type Difficulty,
  type GeneratedQuestion,
  type QuestionType,
} from "@/lib/quizGeneration";

const COURSES = [
  "Advanced TypeScript",
  "TypeScript Generics Masterclass",
  "Node.js Production Patterns",
  "Full-Stack Testing Guide",
];

type Step = "upload" | "configure" | "generating" | "review";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (quiz: {
    id: string;
    title: string;
    course: string;
    questions: number;
    status: "Draft" | "Published";
    sourceFile: string;
  }) => void;
};

const STEPS: Step[] = ["upload", "configure", "generating", "review"];

export default function PdfQuizWizard({ open, onClose, onSaved }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState(COURSES[0]);
  const [questionCount, setQuestionCount] = useState(8);
  const [difficulty, setDifficulty] = useState<Difficulty>("mixed");
  const [types, setTypes] = useState<QuestionType[]>(["mcq", "true_false"]);

  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [sourceFile, setSourceFile] = useState("");
  const [quizId, setQuizId] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep("upload");
    setFile(null);
    setDragOver(false);
    setFileError(null);
    setTitle("");
    setCourse(COURSES[0]);
    setQuestionCount(8);
    setDifficulty("mixed");
    setTypes(["mcq", "true_false"]);
    setProgress(0);
    setProgressLabel("");
    setQuestions([]);
    setSourceFile("");
    setQuizId("");
    setSaving(false);
    setEditingId(null);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "generating") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  const acceptFile = (f: File) => {
    const err = validatePdfFile(f);
    if (err) {
      setFileError(err);
      setFile(null);
      toast.error(err);
      return;
    }
    setFileError(null);
    setFile(f);
    if (!title) {
      const base = f.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ");
      setTitle(`${base} — Quiz`);
    }
    toast.success("PDF ready", { description: f.name });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) acceptFile(f);
  };

  const toggleType = (t: QuestionType) => {
    setTypes((prev) => {
      if (prev.includes(t)) {
        if (prev.length === 1) {
          toast.message("Keep at least one question type");
          return prev;
        }
        return prev.filter((x) => x !== t);
      }
      return [...prev, t];
    });
  };

  const startGenerate = async () => {
    if (!file) return;
    setStep("generating");
    setProgress(0);
    try {
      const result = await generateQuizFromPdf(
        { file, title, course, questionCount, difficulty, types },
        (pct, label) => {
          setProgress(pct);
          setProgressLabel(label);
        },
      );
      setQuestions(result.questions);
      setSourceFile(result.sourceFile);
      setQuizId(result.quizId);
      setStep("review");
      toast.success("Quiz generated", {
        description: `${result.questions.length} questions from ${result.sourceFile}`,
      });
    } catch {
      toast.error("Generation failed", { description: "Please try again." });
      setStep("configure");
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.message("Question removed");
  };

  const regenerateOne = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              prompt: `[Regenerated] ${q.prompt.replace(/^\[Regenerated\]\s*/, "")}`,
              id: `gq-${Date.now()}`,
            }
          : q,
      ),
    );
    toast.success("Question regenerated");
  };

  const updateQuestion = (id: string, patch: Partial<GeneratedQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const save = async (status: "Draft" | "Published") => {
    if (questions.length === 0) {
      toast.error("Add at least one question");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSaved({
      id: quizId || `iq-${Date.now()}`,
      title: title.trim() || "Untitled quiz",
      course,
      questions: questions.length,
      status,
      sourceFile,
    });
    setSaving(false);
    toast.success(status === "Published" ? "Quiz published" : "Draft saved", {
      description: title,
    });
    onClose();
  };

  const stepIndex = STEPS.indexOf(step);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6"
        onClick={() => step !== "generating" && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Wand2 className="h-4 w-4 text-amber-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-white font-serif truncate">
                  Generate quiz from PDF
                </h3>
                <p className="text-xs text-zinc-500 truncate">
                  Upload a document — AI builds questions (backend soon)
                </p>
              </div>
            </div>
            <button
              disabled={step === "generating"}
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stepper */}
          <div className="shrink-0 px-5 sm:px-6 py-3 border-b border-zinc-800/80 flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {(["Upload", "Configure", "Generate", "Review"] as const).map((label, i) => (
              <div key={label} className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors",
                    i < stepIndex
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : i === stepIndex
                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        : "bg-zinc-950 text-zinc-600 border-zinc-800",
                  )}
                >
                  <span
                    className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                      i < stepIndex
                        ? "bg-emerald-500 text-zinc-950"
                        : i === stepIndex
                          ? "bg-amber-500 text-zinc-950"
                          : "bg-zinc-800 text-zinc-500",
                    )}
                  >
                    {i < stepIndex ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 3 && <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <AnimatePresence mode="wait">
              {step === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        inputRef.current?.click();
                      }
                    }}
                    className={cn(
                      "relative cursor-pointer rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40",
                      dragOver
                        ? "border-amber-500 bg-amber-500/10 scale-[1.01]"
                        : file
                          ? "border-emerald-500/40 bg-emerald-500/5"
                          : "border-zinc-700 bg-zinc-950/50 hover:border-amber-500/40 hover:bg-amber-500/5",
                    )}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) acceptFile(f);
                        e.target.value = "";
                      }}
                    />
                    <motion.div
                      animate={dragOver ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
                      className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
                    >
                      {file ? (
                        <FileText className="h-7 w-7 text-emerald-400" />
                      ) : (
                        <Upload className="h-7 w-7 text-amber-500" />
                      )}
                    </motion.div>
                    {file ? (
                      <>
                        <p className="text-base font-medium text-white">{file.name}</p>
                        <p className="mt-1 text-sm text-zinc-500">{formatBytes(file.size)} · PDF</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setFileError(null);
                          }}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove file
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-base font-medium text-white">
                          Drop your PDF here, or click to browse
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                          Lecture notes, slides, or handouts · max 15 MB
                        </p>
                      </>
                    )}
                  </div>
                  {fileError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {fileError}
                    </motion.div>
                  )}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-xs text-zinc-500 leading-relaxed">
                    <span className="text-amber-400 font-medium">How it works:</span> We upload the
                    PDF to your instructor workspace, extract text on the backend, and return AI-generated
                    questions. Right now this is simulated end-to-end so you can build and review the full UI.
                  </div>
                </motion.div>
              )}

              {step === "configure" && (
                <motion.div
                  key="configure"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                    <FileText className="h-5 w-5 text-amber-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{file?.name}</p>
                      <p className="text-xs text-zinc-500">{file ? formatBytes(file.size) : ""}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-500">Quiz title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                      placeholder="e.g. Module 3 — Generics Quiz"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-500">Assign to course</label>
                    <div className="mt-1.5 relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <select
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none"
                      >
                        {COURSES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider text-zinc-500">
                        Number of questions
                      </label>
                      <span className="text-sm font-semibold text-amber-400">{questionCount}</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={15}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="mt-3 w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                      <span>3</span>
                      <span>15</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-500">Difficulty</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(["easy", "medium", "hard", "mixed"] as Difficulty[]).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all",
                            difficulty === d
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/40 scale-105"
                              : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white",
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-zinc-500">Question types</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(
                        [
                          { id: "mcq", label: "Multiple choice" },
                          { id: "true_false", label: "True / False" },
                          { id: "short", label: "Short answer" },
                        ] as { id: QuestionType; label: string }[]
                      ).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleType(t.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            types.includes(t.id)
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/40"
                              : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white",
                          )}
                        >
                          {types.includes(t.id) && <Check className="inline h-3 w-3 mr-1" />}
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "generating" && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-10 flex flex-col items-center text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6"
                  >
                    <Sparkles className="h-8 w-8 text-amber-400" />
                  </motion.div>
                  <h4 className="text-xl font-serif text-white">Generating your quiz</h4>
                  <p className="mt-2 text-sm text-zinc-400 max-w-sm">{progressLabel || "Starting…"}</p>
                  <div className="mt-8 w-full max-w-md">
                    <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut", duration: 0.35 }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-amber-400/80 font-medium">{progress}%</p>
                  </div>
                </motion.div>
              )}

              {step === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-zinc-400">
                      <span className="text-white font-medium">{questions.length}</span> questions from{" "}
                      <span className="text-amber-400">{sourceFile}</span>
                    </p>
                    <p className="text-xs text-zinc-600">Click a question to edit · hover for actions</p>
                  </div>

                  <ul className="space-y-3">
                    {questions.map((q, idx) => (
                      <motion.li
                        key={q.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="group rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-amber-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                                Q{idx + 1}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-zinc-700 text-zinc-400 capitalize">
                                {q.type.replace("_", " ")}
                              </span>
                            </div>
                            {editingId === q.id ? (
                              <textarea
                                autoFocus
                                value={q.prompt}
                                onChange={(e) => updateQuestion(q.id, { prompt: e.target.value })}
                                onBlur={() => setEditingId(null)}
                                rows={2}
                                className="w-full rounded-lg border border-amber-500/40 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none resize-none"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditingId(q.id)}
                                className="text-left text-sm text-white hover:text-amber-200 transition-colors"
                              >
                                {q.prompt}
                              </button>
                            )}
                            <ul className="mt-3 space-y-1.5">
                              {q.options.map((opt, oi) => (
                                <li
                                  key={oi}
                                  className={cn(
                                    "text-xs rounded-md px-2.5 py-1.5 border",
                                    oi === q.answerIndex
                                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                      : "border-zinc-800 text-zinc-500",
                                  )}
                                >
                                  {opt}
                                  {oi === q.answerIndex && (
                                    <Check className="inline h-3 w-3 ml-1.5" />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              title="Regenerate"
                              onClick={() => regenerateOne(q.id)}
                              className="p-1.5 rounded-md text-zinc-500 hover:text-amber-400 hover:bg-white/5 transition-colors"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Remove"
                              onClick={() => removeQuestion(q.id)}
                              className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {step !== "generating" && (
            <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80">
              <button
                type="button"
                onClick={() => {
                  if (step === "upload") onClose();
                  else if (step === "configure") setStep("upload");
                  else if (step === "review") setStep("configure");
                }}
                className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                {step === "upload" ? "Cancel" : "Back"}
              </button>

              <div className="flex flex-wrap gap-2">
                {step === "upload" && (
                  <button
                    type="button"
                    disabled={!file}
                    onClick={() => setStep("configure")}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors"
                  >
                    Continue <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                {step === "configure" && (
                  <button
                    type="button"
                    disabled={!title.trim() || !file}
                    onClick={startGenerate}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate quiz
                  </button>
                )}
                {step === "review" && (
                  <>
                    <button
                      type="button"
                      disabled={saving || questions.length === 0}
                      onClick={() => save("Draft")}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 hover:border-amber-500/40 px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-40"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Save draft
                    </button>
                    <button
                      type="button"
                      disabled={saving || questions.length === 0}
                      onClick={() => save("Published")}
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Publish quiz
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
