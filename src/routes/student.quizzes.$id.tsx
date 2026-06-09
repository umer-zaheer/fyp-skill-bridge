import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronLeft,
  CircleCheck,
  Clock,
  Flag,
  Flame,
  HelpCircle,
  RotateCcw,
  Send,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/quizzes/$id")({ component: QuizPage });

type Question = {
  id: number;
  prompt: string;
  hint?: string;
  options: string[];
  answer: number;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "What does the `infer` keyword enable inside a conditional type?",
    hint: "Think pattern matching at the type level.",
    options: [
      "Declaring a new generic parameter at the call site",
      "Capturing a type from within a pattern for later use",
      "Forcing a union to distribute eagerly",
      "Narrowing a value at runtime",
    ],
    answer: 1,
  },
  {
    id: 2,
    prompt: "Which utility maps every property of T to readonly?",
    options: ["Partial<T>", "Required<T>", "Readonly<T>", "Pick<T, K>"],
    answer: 2,
  },
  {
    id: 3,
    prompt: "Distributive conditional types distribute over…",
    options: ["Intersections", "Tuples", "Naked type parameters that are unions", "Object literals"],
    answer: 2,
  },
  {
    id: 4,
    prompt: "Which keyword extracts the resolved type of a Promise?",
    options: ["Resolve", "Awaited", "Unwrap", "Settle"],
    answer: 1,
  },
  {
    id: 5,
    prompt: "Key remapping in mapped types uses which clause?",
    options: ["`in`", "`as`", "`extends`", "`keyof`"],
    answer: 1,
  },
];

const TOTAL_SECONDS = 15 * 60;

function QuizPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setSeconds((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  useEffect(() => { if (seconds === 0) setSubmitted(true); }, [seconds]);
  useEffect(() => { setShowHint(false); }, [current]);

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / QUESTIONS.length) * 100);
  const score = useMemo(
    () => QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0), 0),
    [answers],
  );
  const timerPct = (seconds / TOTAL_SECONDS) * 100;
  const lowTime = seconds <= 60;

  const q = QUESTIONS[current];

  const pick = (optIndex: number) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [q.id]: optIndex }));
  };

  const goPrev = () => setCurrent((i) => Math.max(0, i - 1));
  const goNext = () => setCurrent((i) => Math.min(QUESTIONS.length - 1, i + 1));

  if (submitted) return <ResultScreen score={score} total={QUESTIONS.length} questions={QUESTIONS} answers={answers} onRetake={() => { setAnswers({}); setFlagged({}); setSeconds(TOTAL_SECONDS); setSubmitted(false); setCurrent(0); }} onExit={() => navigate({ to: "/student/courses" })} quizId={id} />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[680px] rounded-full bg-fuchsia-500/5 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      {/* Sticky header */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/student/courses" className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 text-zinc-300 transition group-hover:-translate-x-0.5" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-amber-300/80">
                <Sparkles className="h-3 w-3" /> Quiz · {id}
              </div>
              <h1 className="truncate font-serif text-lg leading-tight">
                Advanced TypeScript · <span className="text-zinc-400">Conditional & mapped types</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs md:flex">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-zinc-300">Answered</span>
              <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
              </div>
              <span className="font-medium tabular-nums text-amber-200">{answeredCount}/{QUESTIONS.length}</span>
            </div>

            <Timer seconds={seconds} pct={timerPct} low={lowTime} />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
        {/* MAIN */}
        <div className="min-w-0 space-y-6">
          {/* Question card */}
          <Tilt
            glareEnable
            glareMaxOpacity={0.12}
            glareColor="#fbbf24"
            tiltMaxAngleX={2.5}
            tiltMaxAngleY={2.5}
            transitionSpeed={1500}
            perspective={1400}
            className="rounded-3xl"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-8 shadow-[0_30px_120px_-40px_rgba(251,191,36,0.35)] backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-amber-300/80">Question {current + 1} of {QUESTIONS.length}</div>
                  <motion.h2
                    key={q.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="mt-3 font-serif text-2xl leading-snug text-white md:text-3xl"
                  >
                    {q.prompt}
                  </motion.h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl border transition",
                      flagged[q.id]
                        ? "border-amber-300/50 bg-amber-300/15 text-amber-200"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:text-amber-200",
                    )}
                    title="Flag for review"
                  >
                    {flagged[q.id] ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                  {q.hint && (
                    <button
                      onClick={() => setShowHint((s) => !s)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:text-amber-200"
                      title="Hint"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Hint */}
              <AnimatePresence>
                {showHint && q.hint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    className="relative mt-4 overflow-hidden rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm text-amber-100/90"
                  >
                    <Flame className="mr-2 inline-block h-3.5 w-3.5 text-amber-300" />
                    {q.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="relative mt-8 grid gap-3"
                >
                  {q.options.map((opt, i) => {
                    const picked = answers[q.id] === i;
                    return (
                      <motion.button
                        key={i}
                        onClick={() => pick(i)}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        className={cn(
                          "group relative flex items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition",
                          picked
                            ? "border-amber-300/50 bg-gradient-to-r from-amber-400/15 via-amber-400/5 to-transparent text-amber-50"
                            : "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/20 hover:bg-white/[0.05]",
                        )}
                      >
                        <span
                          className={cn(
                            "relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border font-serif text-sm transition",
                            picked
                              ? "border-amber-300/60 bg-amber-300/20 text-amber-100"
                              : "border-white/10 bg-white/[0.04] text-zinc-400 group-hover:text-zinc-200",
                          )}
                        >
                          {String.fromCharCode(65 + i)}
                          {picked && (
                            <motion.span
                              layoutId="picked-glow"
                              className="absolute inset-0 rounded-xl ring-2 ring-amber-300/40"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                        </span>
                        <span className="flex-1 text-sm md:text-base">{opt}</span>
                        {picked && (
                          <motion.span
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-zinc-950"
                          >
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </motion.span>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Nav buttons */}
              <div className="relative mt-8 flex items-center justify-between">
                <button
                  onClick={goPrev}
                  disabled={current === 0}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="hidden gap-1 sm:flex">
                  {QUESTIONS.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 w-6 rounded-full transition",
                        i === current ? "bg-amber-300" : answers[QUESTIONS[i].id] !== undefined ? "bg-amber-300/40" : "bg-white/10",
                      )}
                    />
                  ))}
                </div>

                {current < QUESTIONS.length - 1 ? (
                  <button
                    onClick={goNext}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmSubmit(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
                  >
                    <Send className="h-4 w-4" /> Submit quiz
                  </button>
                )}
              </div>
            </div>
          </Tilt>
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start space-y-4">
          <Tilt
            glareEnable
            glareMaxOpacity={0.08}
            glareColor="#fbbf24"
            tiltMaxAngleX={2}
            tiltMaxAngleY={2}
            transitionSpeed={1800}
            className="rounded-2xl"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl">
              <div className="border-b border-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-amber-300/80">Navigator</div>
                    <div className="mt-1 font-serif text-lg">Jump to question</div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
                    <Flag className="h-4 w-4 text-amber-300" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 p-5">
                {QUESTIONS.map((qq, i) => {
                  const answered = answers[qq.id] !== undefined;
                  const isCurrent = i === current;
                  const isFlagged = flagged[qq.id];
                  return (
                    <motion.button
                      key={qq.id}
                      onClick={() => setCurrent(i)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative aspect-square rounded-xl border text-sm font-serif transition",
                        isCurrent && "border-amber-300/60 bg-gradient-to-br from-amber-400/30 to-rose-400/20 text-amber-50 shadow-lg shadow-amber-500/20",
                        !isCurrent && answered && "border-amber-300/30 bg-amber-300/10 text-amber-200",
                        !isCurrent && !answered && "border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                      )}
                    >
                      {i + 1}
                      {isFlagged && (
                        <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-300 text-[8px] text-zinc-950">
                          <Flag className="h-2 w-2" strokeWidth={3} />
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="space-y-2 border-t border-white/5 p-5 text-xs">
                <LegendDot color="from-amber-400/30 to-rose-400/20" label="Current" border="border-amber-300/60" />
                <LegendDot color="from-amber-300/10 to-amber-300/10" label="Answered" border="border-amber-300/30" />
                <LegendDot color="from-white/[0.03] to-white/[0.03]" label="Unanswered" border="border-white/10" />
              </div>
            </div>
          </Tilt>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
              <Clock className="h-3 w-3" /> Tips
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-400">
              <li>• Flag tough questions and return later.</li>
              <li>• You can change answers before submitting.</li>
              <li>• Auto-submits when the timer runs out.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Submit confirmation */}
      <AnimatePresence>
        {confirmSubmit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-6 backdrop-blur-md"
            onClick={() => setConfirmSubmit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-400 text-zinc-950">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-serif text-lg">Submit quiz?</div>
                    <div className="text-xs text-zinc-400">You can't change answers after submitting.</div>
                  </div>
                </div>
                <button onClick={() => setConfirmSubmit(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <Stat label="Answered" value={`${answeredCount}/${QUESTIONS.length}`} />
                <Stat label="Flagged" value={String(Object.values(flagged).filter(Boolean).length)} />
                <Stat label="Time left" value={formatTime(seconds)} />
              </div>
              <div className="mt-6 flex items-center justify-end gap-2">
                <button onClick={() => setConfirmSubmit(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10">
                  Keep going
                </button>
                <button
                  onClick={() => { setConfirmSubmit(false); setSubmitted(true); }}
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 px-5 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
                >
                  Submit now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendDot({ color, label, border }: { color: string; label: string; border: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-400">
      <span className={cn("h-3 w-3 rounded-md border bg-gradient-to-br", color, border)} />
      {label}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] py-3">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-0.5 font-serif text-base text-amber-100">{value}</div>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Timer({ seconds, pct, low }: { seconds: number; pct: number; low: boolean }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className={cn(
      "relative flex items-center gap-3 rounded-2xl border bg-white/5 px-3 py-1.5 backdrop-blur transition",
      low ? "border-rose-400/40 shadow-[0_0_30px_-8px_rgba(244,63,94,0.5)]" : "border-white/10",
    )}>
      <div className="relative h-10 w-10">
        <svg viewBox="0 0 44 44" className="h-10 w-10 -rotate-90">
          <circle cx="22" cy="22" r={r} className="fill-none stroke-white/10" strokeWidth="3" />
          <motion.circle
            cx="22" cy="22" r={r}
            className={cn("fill-none transition-colors", low ? "stroke-rose-400" : "stroke-amber-300")}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>
        <Clock className={cn("absolute inset-0 m-auto h-4 w-4", low ? "text-rose-300" : "text-amber-200")} />
      </div>
      <div className="pr-1">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">Time left</div>
        <motion.div
          key={Math.floor(seconds / 10)}
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 1 }}
          className={cn("font-serif text-base tabular-nums", low ? "text-rose-200" : "text-amber-100")}
        >
          {formatTime(seconds)}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- RESULT SCREEN ---------------- */
function ResultScreen({
  score, total, questions, answers, onRetake, onExit, quizId,
}: {
  score: number; total: number; questions: Question[]; answers: Record<number, number>;
  onRetake: () => void; onExit: () => void; quizId: string;
}) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 60;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={cn(
          "absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full blur-[140px]",
          passed ? "bg-amber-500/15" : "bg-rose-500/10",
        )} />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/student/courses" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to courses
        </Link>

        <Tilt glareEnable glareMaxOpacity={0.15} glareColor="#fbbf24" tiltMaxAngleX={3} tiltMaxAngleY={3} className="mt-6 rounded-3xl">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-10 text-center shadow-[0_30px_120px_-40px_rgba(251,191,36,0.35)] backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className={cn(
                "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-2xl",
                passed ? "from-amber-400 to-rose-400 shadow-amber-500/40" : "from-rose-400 to-rose-600 shadow-rose-500/30",
              )}
            >
              {passed ? <Trophy className="h-9 w-9 text-zinc-950" /> : <RotateCcw className="h-9 w-9 text-white" />}
            </motion.div>

            <div className="mt-5 text-[11px] uppercase tracking-[0.2em] text-amber-300/80">Quiz {quizId}</div>
            <h1 className="mt-2 font-serif text-4xl">
              {passed ? "Beautifully done." : "Almost there."}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              You scored <span className="font-semibold text-amber-200">{score}/{total}</span> · {pct}% accuracy.
            </p>

            <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={cn("h-full rounded-full bg-gradient-to-r", passed ? "from-amber-400 to-rose-400" : "from-rose-400 to-rose-600")}
              />
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button onClick={onRetake} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/10">
                <RotateCcw className="h-4 w-4" /> Retake
              </button>
              <button onClick={onExit} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]">
                Continue learning <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Tilt>

        <div className="mt-8 space-y-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Review answers</div>
          {questions.map((q, i) => {
            const picked = answers[q.id];
            const correct = picked === q.answer;
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  "rounded-2xl border p-5",
                  correct ? "border-emerald-400/30 bg-emerald-400/5" : "border-rose-400/30 bg-rose-400/5",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">Question {i + 1}</div>
                    <div className="mt-1 text-sm font-medium text-zinc-100">{q.prompt}</div>
                  </div>
                  <span className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                    correct ? "bg-emerald-400/20 text-emerald-200" : "bg-rose-400/20 text-rose-200",
                  )}>
                    {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs">
                  <div className="text-zinc-400">
                    Your answer: <span className={cn(correct ? "text-emerald-200" : "text-rose-200")}>{picked !== undefined ? q.options[picked] : "— skipped —"}</span>
                  </div>
                  {!correct && (
                    <div className="text-zinc-400">
                      Correct answer: <span className="text-emerald-200">{q.options[q.answer]}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
