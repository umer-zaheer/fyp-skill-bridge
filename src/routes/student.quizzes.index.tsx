import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  FileQuestion,
  Flame,
  ListChecks,
  Lock,
  Play,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/quizzes/")({ component: QuizzesIndex });

type Quiz = {
  id: string;
  title: string;
  course: string;
  questions: number;
  minutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "Available" | "In Progress" | "Completed" | "Locked";
  score?: number;
  attempts: number;
  bestStreak?: number;
  color: string;
  tag: string;
};

const QUIZZES: Quiz[] = [
  { id: "1", title: "Conditional & Mapped Types", course: "Advanced TypeScript", questions: 5, minutes: 15, difficulty: "Advanced", status: "Completed", score: 100, attempts: 3, bestStreak: 10, color: "from-amber-400 via-orange-500 to-rose-500", tag: "TS" },
  { id: "2", title: "Generics Deep Dive", course: "Advanced TypeScript", questions: 8, minutes: 20, difficulty: "Advanced", status: "In Progress", attempts: 1, color: "from-fuchsia-500 via-purple-500 to-amber-500", tag: "GN" },
  { id: "3", title: "Design Tokens 101", course: "Design Systems with Figma", questions: 6, minutes: 12, difficulty: "Intermediate", status: "Completed", score: 92, attempts: 2, bestStreak: 5, color: "from-emerald-500 via-teal-500 to-amber-500", tag: "DT" },
  { id: "4", title: "Pandas Fundamentals", course: "Data Science 101", questions: 10, minutes: 25, difficulty: "Beginner", status: "Completed", score: 88, attempts: 1, bestStreak: 7, color: "from-sky-500 via-cyan-500 to-amber-500", tag: "PD" },
  { id: "5", title: "React Rendering Model", course: "React Performance", questions: 7, minutes: 18, difficulty: "Advanced", status: "Available", attempts: 0, color: "from-indigo-500 via-blue-500 to-amber-500", tag: "RX" },
  { id: "6", title: "Positioning Frameworks", course: "Product Marketing", questions: 6, minutes: 14, difficulty: "Intermediate", status: "Available", attempts: 0, color: "from-rose-500 via-pink-500 to-amber-500", tag: "PM" },
  { id: "7", title: "Ownership & Borrowing", course: "Rust for Web Devs", questions: 9, minutes: 22, difficulty: "Advanced", status: "Locked", attempts: 0, color: "from-orange-500 via-red-500 to-amber-500", tag: "RS" },
  { id: "8", title: "Brand Voice Foundations", course: "Brand Identity Studio", questions: 5, minutes: 10, difficulty: "Beginner", status: "Locked", attempts: 0, color: "from-violet-500 via-fuchsia-500 to-amber-500", tag: "BV" },
];

const STATUSES = ["All", "Available", "In Progress", "Completed", "Locked"] as const;
const DIFFS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

function QuizzesIndex() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [diff, setDiff] = useState<(typeof DIFFS)[number]>("All");

  const filtered = useMemo(
    () =>
      QUIZZES.filter((x) => {
        if (status !== "All" && x.status !== status) return false;
        if (diff !== "All" && x.difficulty !== diff) return false;
        if (q && !(`${x.title} ${x.course}`.toLowerCase().includes(q.toLowerCase()))) return false;
        return true;
      }),
    [q, status, diff],
  );

  const stats = useMemo(() => {
    const completed = QUIZZES.filter((x) => x.status === "Completed");
    const avg = completed.length
      ? Math.round(completed.reduce((a, b) => a + (b.score ?? 0), 0) / completed.length)
      : 0;
    return {
      total: QUIZZES.length,
      completed: completed.length,
      avg,
      streak: 12,
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[680px] rounded-full bg-fuchsia-500/5 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-[1500px] px-6 py-8 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-amber-300/80">
              <Sparkles className="h-3 w-3" /> Quizzes
            </div>
            <h1 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">
              Sharpen the edge. <span className="text-zinc-400">Test what you know.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Time-boxed, beautifully crafted assessments across every course you're taking.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat icon={ListChecks} label="Total" value={String(stats.total)} />
            <Stat icon={CheckCircle2} label="Completed" value={String(stats.completed)} />
            <Stat icon={Trophy} label="Avg score" value={`${stats.avg}%`} />
            <Stat icon={Flame} label="Day streak" value={String(stats.streak)} />
          </div>
        </motion.div>

        {/* Filter bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-xl md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search quizzes or courses…"
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Filter className="h-3.5 w-3.5" />
            <Chips value={status} onChange={setStatus} options={STATUSES} />
            <Chips value={diff} onChange={setDiff} options={DIFFS} />
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((quiz, i) => (
              <QuizCard key={quiz.id} quiz={quiz} delay={i * 0.05} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-rose-500/10 text-amber-300">
              <FileQuestion className="h-6 w-6" />
            </div>
            <div className="font-serif text-lg">No quizzes match those filters</div>
            <p className="max-w-sm text-center text-sm text-zinc-500">
              Try clearing a filter or searching for a different course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Chips<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: readonly T[] }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/60 p-1">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-[11px] font-medium transition",
            value === o ? "bg-amber-300/15 text-amber-200" : "text-zinc-400 hover:text-zinc-200",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-500">
        <Icon className="h-3 w-3 text-amber-300" /> {label}
      </div>
      <div className="mt-1 font-serif text-xl text-amber-100">{value}</div>
    </div>
  );
}

function QuizCard({ quiz, delay }: { quiz: Quiz; delay: number }) {
  const locked = quiz.status === "Locked";
  const completed = quiz.status === "Completed";
  const inProgress = quiz.status === "In Progress";

  const cta = locked ? "Locked" : completed ? "Review attempt" : inProgress ? "Resume quiz" : "Start quiz";

  const Inner = (
    <Tilt
      glareEnable
      glareMaxOpacity={0.18}
      glareColor="#fbbf24"
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      scale={1.015}
      transitionSpeed={1500}
      perspective={1100}
      className="rounded-2xl h-full"
    >
      <div className={cn(
        "group relative h-full overflow-hidden rounded-2xl border bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-5 backdrop-blur-xl transition",
        locked ? "border-white/5 opacity-70" : "border-white/10 hover:border-amber-300/30",
      )}>
        {/* Thumbnail strip */}
        <div className={cn("relative h-28 w-full overflow-hidden rounded-xl bg-gradient-to-br", quiz.color)}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.5))]" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/15 font-serif text-lg text-white backdrop-blur"
          >
            {quiz.tag}
          </motion.div>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/80">{quiz.difficulty}</div>
              <div className="text-xs text-white/90">{quiz.course}</div>
            </div>
            <StatusPill status={quiz.status} />
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 space-y-3">
          <h3 className="font-serif text-lg leading-snug text-white group-hover:text-amber-100">{quiz.title}</h3>
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><ListChecks className="h-3 w-3 text-amber-300" /> {quiz.questions} Qs</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-300" /> {quiz.minutes} min</span>
            {quiz.attempts > 0 && <><span>·</span><span>{quiz.attempts} attempt{quiz.attempts > 1 ? "s" : ""}</span></>}
          </div>

          {completed && quiz.score !== undefined && (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200">Best score</span>
                <span className="font-serif text-lg text-emerald-100">{quiz.score}%</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div initial={{ width: 0 }} animate={{ width: `${quiz.score}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-emerald-400 to-amber-400" />
              </div>
            </div>
          )}

          {inProgress && (
            <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs text-amber-100/90">
              <Flame className="mr-1.5 inline-block h-3 w-3" /> You stopped mid-quiz — pick up where you left off.
            </div>
          )}

          {/* CTA */}
          <div className={cn(
            "mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition",
            locked
              ? "border-white/10 bg-white/5 text-zinc-500"
              : "border-amber-500/30 bg-zinc-100/5 text-amber-300 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-950",
          )}>
            {locked ? <Lock className="h-4 w-4" /> : completed ? <ArrowRight className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {cta}
          </div>
        </div>
      </div>
    </Tilt>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay, duration: 0.4 }}
    >
      {locked ? (
        <div className="cursor-not-allowed">{Inner}</div>
      ) : (
        <Link to="/student/quiz-result/$id" params={{ id: quiz.id }} className="block">
          {Inner}
        </Link>
      )}
    </motion.div>
  );
}

function StatusPill({ status }: { status: Quiz["status"] }) {
  const map: Record<Quiz["status"], string> = {
    Available: "bg-white/15 text-white border-white/30",
    "In Progress": "bg-amber-300/20 text-amber-100 border-amber-200/40",
    Completed: "bg-emerald-400/20 text-emerald-100 border-emerald-300/40",
    Locked: "bg-zinc-800/60 text-zinc-300 border-white/10",
  };
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest backdrop-blur", map[status])}>
      {status}
    </span>
  );
}
