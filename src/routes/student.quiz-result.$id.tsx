import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Flame,
  Frown,
  Lightbulb,
  Medal,
  RefreshCcw,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/quiz-result/$id")({ component: QuizResultPage });

// ---------- Mock data ----------
const RESULT = {
  id: "1",
  title: "Conditional & Mapped Types",
  course: "Advanced TypeScript",
  score: 4,
  total: 5,
  correct: 4,
  wrong: 1,
  rank: 3,
  percentile: 94,
  timeTaken: "12:34",
  avgTime: "14:00",
  feedback: [
    "Excellent grasp of conditional types — you nailed the `infer` pattern.",
    "Take a closer look at mapped-type key remapping with `as`. One small slip there.",
    "Overall pacing was strong. You finished 1m 26s under the average.",
  ],
  weakAreas: [
    { topic: "Key remapping in mapped types", severity: "medium" as const },
    { topic: "Distributive conditional edge cases", severity: "low" as const },
  ],
  aiSuggestions: [
    "Try rewriting the `Readonly<T>` utility manually with `as` remapping to reinforce the concept.",
    "Review the difference between wrapped and naked type parameters in conditionals.",
    "Practice by building a `DeepReadonly<T>` recursive mapped type.",
  ],
  recommended: [
    { title: "Mapped Types Masterclass", course: "Advanced TypeScript", level: "Advanced", rating: 4.9, lessons: 6, color: "from-amber-400 via-orange-500 to-rose-500" },
    { title: "Generics Deep Dive", course: "Advanced TypeScript", level: "Advanced", rating: 4.8, lessons: 8, color: "from-fuchsia-500 via-purple-500 to-amber-500" },
    { title: "Type-Level Programming", course: "TypeScript Pro", level: "Expert", rating: 4.9, lessons: 10, color: "from-emerald-500 via-teal-500 to-amber-500" },
  ],
  leaderboard: [
    { name: "Emma R.", score: 5, streak: 12, avatar: "ER" },
    { name: "Liam K.", score: 5, streak: 8, avatar: "LK" },
    { name: "You", score: 4, streak: 7, avatar: "YO", isYou: true },
    { name: "Noah T.", score: 4, streak: 5, avatar: "NT" },
    { name: "Olivia M.", score: 3, streak: 3, avatar: "OM" },
  ],
};

const pct = Math.round((RESULT.score / RESULT.total) * 100);
const passed = pct >= 60;

// ---------- Animation variants ----------
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

// ---------- Components ----------
function QuizResultPage() {
  const { id } = Route.useParams();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={cn(
          "absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full blur-[140px]",
          passed ? "bg-amber-500/12" : "bg-rose-500/10",
        )} />
        <div className="absolute bottom-0 right-0 h-[380px] w-[680px] rounded-full bg-fuchsia-500/5 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-[1500px] px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <Link
              to="/student/quizzes"
              className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-amber-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to quizzes
            </Link>
            <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-amber-300/80">
              <Sparkles className="h-3 w-3" /> Quiz result · {id}
            </div>
            <h1 className="mt-1 font-serif text-3xl leading-tight md:text-4xl">
              {RESULT.course} · <span className="text-zinc-400">{RESULT.title}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 transition hover:bg-white/10 hover:scale-[1.02]">
              <RefreshCcw className="h-4 w-4" /> Retake
            </button>
            <Link
              to="/student/courses"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
            >
              Continue learning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Score Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main score card */}
          <Tilt
            glareEnable
            glareMaxOpacity={0.15}
            glareColor="#fbbf24"
            tiltMaxAngleX={4}
            tiltMaxAngleY={4}
            transitionSpeed={1500}
            perspective={1100}
            className="lg:col-span-2 rounded-3xl"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/80 to-zinc-950/80 p-8 md:p-10 shadow-[0_30px_120px_-40px_rgba(251,191,36,0.3)] backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

              <div className="relative flex flex-col md:flex-row items-center gap-8">
                {/* Circular score */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.15 }}
                  className="relative flex-shrink-0"
                >
                  <div className="relative h-44 w-44">
                    <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                      <circle cx="80" cy="80" r="68" className="fill-none stroke-white/10" strokeWidth="10" />
                      <motion.circle
                        cx="80" cy="80" r="68"
                        className={cn("fill-none", passed ? "stroke-amber-400" : "stroke-rose-400")}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 68}
                        initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - pct / 100) }}
                        transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className={cn("font-serif text-5xl font-bold", passed ? "text-amber-200" : "text-rose-200")}
                      >
                        {pct}%
                      </motion.span>
                      <span className="mt-1 text-xs text-zinc-500">{RESULT.score}/{RESULT.total}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Score details */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-200"
                    >
                      <Medal className="h-3.5 w-3.5" /> Rank #{RESULT.rank} · Top {100 - RESULT.percentile}%
                    </motion.div>
                  </div>
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="font-serif text-3xl"
                  >
                    {passed ? "Outstanding performance!" : "Keep pushing — you\u2019re close."}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-zinc-400 max-w-md"
                  >
                    You completed the quiz in <span className="text-amber-200 font-medium">{RESULT.timeTaken}</span> (avg {RESULT.avgTime}).
                    {passed
                      ? " Your conditional-type intuition is razor-sharp."
                      : " A little more practice on mapped types and you\u2019ll lock this down."}
                  </motion.p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                    <ScorePill icon={CheckCircle2} label="Correct" value={RESULT.correct} color="emerald" />
                    <ScorePill icon={XCircle} label="Wrong" value={RESULT.wrong} color="rose" />
                    <ScorePill icon={Target} label="Accuracy" value={`${pct}%`} color="amber" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Tilt>

          {/* Leaderboard mini */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold tracking-wide uppercase text-white">Leaderboard</h3>
            </div>
            <div className="space-y-3">
              {RESULT.leaderboard.map((entry, i) => (
                <motion.div
                  key={entry.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition",
                    entry.isYou
                      ? "border-amber-300/30 bg-amber-300/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10",
                  )}
                >
                  <span className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                    i === 0 ? "bg-amber-400/20 text-amber-200" : i === 1 ? "bg-zinc-400/20 text-zinc-300" : i === 2 ? "bg-orange-400/20 text-orange-200" : "text-zinc-500",
                  )}>
                    {i + 1}
                  </span>
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold",
                    entry.isYou ? "bg-gradient-to-br from-amber-400 to-rose-400 text-zinc-950" : "bg-zinc-800 text-zinc-300",
                  )}>
                    {entry.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{entry.name}</div>
                    <div className="text-[10px] text-zinc-500">{entry.streak} day streak</div>
                  </div>
                  <div className="text-sm font-serif text-amber-200">{entry.score}/{RESULT.total}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={CheckCircle2} label="Correct" value={String(RESULT.correct)} sub={`out of ${RESULT.total}`} delay={2} />
          <StatCard icon={XCircle} label="Wrong" value={String(RESULT.wrong)} sub="need practice" delay={3} />
          <StatCard icon={Zap} label="Rank" value={`#${RESULT.rank}`} sub={`top ${RESULT.percentile}%`} delay={4} />
          <StatCard icon={ClockCustom} label="Time" value={RESULT.timeTaken} sub={`avg ${RESULT.avgTime}`} delay={5} />
        </div>

        {/* Feedback + AI Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Feedback */}
          <motion.div
            custom={6}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <ThumbsUp className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold tracking-wide uppercase text-white">Feedback</h3>
            </div>
            <div className="space-y-4">
              {RESULT.feedback.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <div className={cn(
                    "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                    i === 1 ? "bg-amber-300/10 text-amber-300" : "bg-emerald-400/10 text-emerald-300",
                  )}>
                    {i === 1 ? <Lightbulb className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div
            custom={7}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <BrainCircuit className="h-4 w-4 text-fuchsia-400" />
              <h3 className="text-sm font-semibold tracking-wide uppercase text-white">AI Suggestions</h3>
            </div>
            <div className="space-y-4">
              {RESULT.aiSuggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-start gap-3 rounded-xl border border-fuchsia-500/10 bg-fuchsia-500/[0.03] p-4"
                >
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-400/10 text-fuchsia-300">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Weak Areas */}
        <motion.div
          custom={8}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-5">
            <Frown className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-semibold tracking-wide uppercase text-white">Weak Areas</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESULT.weakAreas.map((area, i) => (
              <motion.div
                key={area.topic}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center gap-4 rounded-2xl border border-rose-400/10 bg-rose-400/[0.03] p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
                  <Target className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{area.topic}</div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: area.severity === "medium" ? "65%" : "35%" }}
                      transition={{ duration: 1, delay: 1 + i * 0.15 }}
                      className={cn("h-full rounded-full", area.severity === "medium" ? "bg-rose-400" : "bg-amber-400")}
                    />
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-zinc-500">
                    Priority: {area.severity}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Lessons */}
        <motion.div
          custom={9}
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold tracking-wide uppercase text-white">Recommended Lessons</h3>
            </div>
            <Link
              to="/student/courses"
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Browse all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESULT.recommended.map((lesson, i) => (
              <motion.div
                key={lesson.title}
                custom={i}
                initial="hidden"
                animate="show"
                variants={scaleIn}
              >
                <Tilt
                  glareEnable
                  glareMaxOpacity={0.12}
                  glareColor="#fbbf24"
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  scale={1.02}
                  transitionSpeed={1500}
                  perspective={1100}
                  className="rounded-2xl h-full"
                >
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl transition hover:border-amber-300/30">
                    <div className={cn("relative h-32 w-full overflow-hidden bg-gradient-to-br", lesson.color)}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.5))]" />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur"
                      >
                        <BookOpen className="h-5 w-5" />
                      </motion.div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-200">
                          {lesson.level}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {lesson.rating}
                        </span>
                      </div>
                      <h4 className="font-serif text-base text-white group-hover:text-amber-200 transition-colors">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-zinc-500">{lesson.course}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-zinc-400">{lesson.lessons} lessons</span>
                        <button className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 group-hover:text-amber-200 transition-colors">
                          Start <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ---------- Helpers ----------
function ScorePill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: "emerald" | "rose" | "amber";
}) {
  const colorMap = {
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  };
  return (
    <div className={cn("flex items-center gap-2 rounded-xl border px-3 py-2 text-xs", colorMap[color])}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label}:</span>
      <span className="font-serif">{value}</span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  delay: number;
}) {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition hover:border-amber-300/20"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-500">
        <Icon className="h-3.5 w-3.5 text-amber-300" /> {label}
      </div>
      <div className="mt-2 font-serif text-2xl text-amber-100">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{sub}</div>
    </motion.div>
  );
}

function ClockCustom({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
