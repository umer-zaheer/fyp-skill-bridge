import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  ArrowLeft,
  BookOpen,
  Captions,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Download,
  FileText,
  Gauge,
  Lock,
  Maximize2,
  MessageCircle,
  Mic,
  NotebookPen,
  Pause,
  PictureInPicture2,
  Play,
  Send,
  Settings2,
  Share2,
  Sparkles,
  Star,
  ThumbsUp,
  Trophy,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/courses/$id")({ component: CourseLearn });

type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz" | "reading";
  done?: boolean;
  active?: boolean;
  locked?: boolean;
};
type Module = { id: string; title: string; minutes: number; lessons: Lesson[] };

const MODULES: Module[] = [
  {
    id: "m1",
    title: "Foundations",
    minutes: 64,
    lessons: [
      { id: "l1", title: "Welcome & Setup", duration: "4:12", type: "video", done: true },
      { id: "l2", title: "Mental models", duration: "9:48", type: "video", done: true },
      { id: "l3", title: "Type-level thinking", duration: "12:30", type: "video", done: true },
      { id: "l4", title: "Foundations Quiz", duration: "6 Qs", type: "quiz", done: true },
    ],
  },
  {
    id: "m2",
    title: "Advanced Generics",
    minutes: 92,
    lessons: [
      { id: "l5", title: "Generic constraints", duration: "11:02", type: "video", done: true },
      { id: "l6", title: "Conditional types", duration: "14:21", type: "video", active: true },
      { id: "l7", title: "Mapped types deep dive", duration: "13:08", type: "video" },
      { id: "l8", title: "Reading: Distributive types", duration: "8 min", type: "reading" },
      { id: "l9", title: "Generics Quiz", duration: "8 Qs", type: "quiz" },
    ],
  },
  {
    id: "m3",
    title: "Patterns in Practice",
    minutes: 78,
    lessons: [
      { id: "l10", title: "Builder pattern", duration: "10:14", type: "video" },
      { id: "l11", title: "Strategy with discriminants", duration: "12:55", type: "video" },
      { id: "l12", title: "Inference helpers", duration: "9:32", type: "video", locked: true },
    ],
  },
  {
    id: "m4",
    title: "Capstone",
    minutes: 54,
    lessons: [
      { id: "l13", title: "Capstone brief", duration: "5:48", type: "reading", locked: true },
      { id: "l14", title: "Final quiz", duration: "12 Qs", type: "quiz", locked: true },
    ],
  },
];

const RESOURCES = [
  { name: "Module 2 — Slides.pdf", size: "3.4 MB", type: "PDF" },
  { name: "Conditional Types — Cheatsheet.pdf", size: "812 KB", type: "PDF" },
  { name: "Starter Repository.zip", size: "1.2 MB", type: "ZIP" },
  { name: "Exercises Workbook.pdf", size: "2.1 MB", type: "PDF" },
];

const QUIZ = [
  {
    q: "What does the `infer` keyword enable inside a conditional type?",
    opts: [
      "Declaring a new generic parameter at the call site",
      "Capturing a type from within a pattern for later use",
      "Forcing a union to distribute eagerly",
      "Narrowing a value at runtime",
    ],
    a: 1,
  },
  {
    q: "Which utility maps every property of T to readonly?",
    opts: ["Partial<T>", "Required<T>", "Readonly<T>", "Pick<T, K>"],
    a: 2,
  },
  {
    q: "Distributive conditional types distribute over…",
    opts: ["Intersections", "Tuples", "Naked type parameters that are unions", "Object literals"],
    a: 2,
  },
];

const DISCUSSION = [
  {
    user: "Maya R.",
    role: "Student",
    time: "2h ago",
    text: "The visual on conditional types finally made it click. Anyone has a real-world example beyond ReturnType?",
    likes: 12,
    replies: 3,
  },
  {
    user: "Sarah Lin",
    role: "Instructor",
    time: "1h ago",
    text: "Great question Maya — try modeling a typed event bus with discriminated payloads. I'll drop a gist in resources.",
    likes: 24,
    replies: 1,
  },
  {
    user: "Devon K.",
    role: "Student",
    time: "32m ago",
    text: "Stuck on the mapped-types exercise #3. The key remapping with `as` is throwing me off.",
    likes: 4,
    replies: 0,
  },
];

const TABS = ["Overview", "Resources", "Quiz", "Discussion", "Notes"] as const;
type Tab = (typeof TABS)[number];

export function CourseLearn() {
  const { id } = useParams({ strict: false }) as { id: string };
  const [tab, setTab] = useState<Tab>("Overview");
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({ m1: false, m2: true, m3: false, m4: false });
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(34);
  const [speed, setSpeed] = useState(1);
  const [captions, setCaptions] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [showSettings, setShowSettings] = useState(false);

  // Auto-advance fake playhead
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 0.4 * speed)), 250);
    return () => clearInterval(t);
  }, [playing, speed]);

  const activeLesson = useMemo(() => {
    for (const m of MODULES) for (const l of m.lessons) if (l.active) return { m, l };
    return { m: MODULES[1], l: MODULES[1].lessons[1] };
  }, []);

  const courseProgress = useMemo(() => {
    const all = MODULES.flatMap((m) => m.lessons);
    return Math.round((all.filter((l) => l.done).length / all.length) * 100);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[380px] w-[680px] rounded-full bg-fuchsia-500/5 blur-[140px]" />
      </div>

      {/* Header bar */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/student/courses"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 text-zinc-300 transition group-hover:-translate-x-0.5" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-amber-300/80">
                <Sparkles className="h-3 w-3" /> Course · {id}
              </div>
              <h1 className="truncate font-serif text-lg leading-tight">
                Advanced TypeScript · <span className="text-zinc-400">Module 2 — Conditional types</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs md:flex">
              <Trophy className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-zinc-300">Course progress</span>
              <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${courseProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
                />
              </div>
              <span className="font-medium text-amber-200">{courseProgress}%</span>
            </div>
            <button className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-zinc-200 transition hover:bg-white/10">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_380px]">
        {/* MAIN COLUMN */}
        <div className="min-w-0 space-y-6">
          <VideoPlayer
            playing={playing}
            setPlaying={setPlaying}
            progress={progress}
            setProgress={setProgress}
            speed={speed}
            setSpeed={setSpeed}
            captions={captions}
            setCaptions={setCaptions}
            volume={volume}
            setVolume={setVolume}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            title={activeLesson.l.title}
          />

          {/* Tabs */}
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl">
            <div className="flex items-center gap-1 overflow-x-auto border-b border-white/5 px-2">
              {TABS.map((t) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "relative px-4 py-3 text-sm font-medium transition",
                      active ? "text-amber-200" : "text-zinc-400 hover:text-zinc-200",
                    )}
                  >
                    {t}
                    {active && (
                      <motion.span
                        layoutId="tab-underline"
                        className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {tab === "Overview" && <OverviewPane />}
                  {tab === "Resources" && <ResourcesPane />}
                  {tab === "Quiz" && <QuizPane />}
                  {tab === "Discussion" && <DiscussionPane />}
                  {tab === "Notes" && <NotesPane />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* SIDEBAR — CURRICULUM */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <Tilt
            glareEnable
            glareMaxOpacity={0.08}
            glareColor="#fbbf24"
            glarePosition="all"
            tiltMaxAngleX={2}
            tiltMaxAngleY={2}
            transitionSpeed={1800}
            className="rounded-2xl"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl">
              <div className="border-b border-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-amber-300/80">Curriculum</div>
                    <div className="mt-1 font-serif text-lg">4 modules · 14 lessons</div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
                    <BookOpen className="h-4 w-4 text-amber-300" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-300" /> 4.9</span>
                  <span>·</span>
                  <span>5h 48m total</span>
                  <span>·</span>
                  <span className="text-amber-200">{courseProgress}% done</span>
                </div>
              </div>

              <div className="max-h-[640px] overflow-y-auto p-2 [scrollbar-width:thin]">
                {MODULES.map((m, idx) => (
                  <ModuleRow
                    key={m.id}
                    module={m}
                    index={idx + 1}
                    open={!!openModules[m.id]}
                    onToggle={() => setOpenModules((s) => ({ ...s, [m.id]: !s[m.id] }))}
                  />
                ))}
              </div>
            </div>
          </Tilt>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- VIDEO PLAYER ---------------- */
function VideoPlayer(props: {
  playing: boolean; setPlaying: (b: boolean) => void;
  progress: number; setProgress: (n: number) => void;
  speed: number; setSpeed: (n: number) => void;
  captions: boolean; setCaptions: (b: boolean) => void;
  volume: number; setVolume: (n: number) => void;
  showSettings: boolean; setShowSettings: (b: boolean) => void;
  title: string;
}) {
  const { playing, setPlaying, progress, setProgress, speed, setSpeed, captions, setCaptions, volume, setVolume, showSettings, setShowSettings, title } = props;
  const barRef = useRef<HTMLDivElement>(null);

  const seek = (e: React.MouseEvent) => {
    const el = barRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setProgress(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <Tilt
      glareEnable
      glareMaxOpacity={0.15}
      glareColor="#fbbf24"
      tiltMaxAngleX={3}
      tiltMaxAngleY={3}
      transitionSpeed={1500}
      perspective={1400}
      className="rounded-3xl"
    >
      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_30px_120px_-40px_rgba(251,191,36,0.35)]">
        {/* Fake video stage */}
        <div className="relative aspect-video w-full overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.25),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.2),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(0,0,0,0.7))]" />
          {/* Floating orbs */}
          {[0,1,2,3,4].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-amber-300/20 blur-2xl"
              style={{ width: 80 + i * 20, height: 80 + i * 20, left: `${15 + i * 17}%`, top: `${20 + (i % 2) * 35}%` }}
              animate={{ y: [0, -18, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          {/* Title */}
          <div className="absolute left-6 top-6 right-6 flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-amber-200/80">Now playing</div>
              <div className="mt-1 max-w-xl font-serif text-2xl text-white drop-shadow">{title}</div>
            </div>
            <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200 backdrop-blur">HD · 1080p</div>
          </div>

          {/* Captions */}
          <AnimatePresence>
            {captions && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 text-sm text-zinc-100 backdrop-blur"
              >
                “…conditional types let you express branching logic at the type level — pattern, inference, payoff.”
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center play */}
          <button
            onClick={() => setPlaying(!playing)}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={playing ? "Pause" : "Play"}
          >
            <motion.div
              key={playing ? "p" : "play"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition group-hover:scale-105"
            >
              {playing ? <Pause className="h-8 w-8 text-white" /> : <Play className="ml-1 h-8 w-8 text-white" />}
            </motion.div>
          </button>

          {/* Controls */}
          <div className="absolute inset-x-0 bottom-0 z-10 space-y-2 p-4">
            {/* Progress bar */}
            <div
              ref={barRef}
              onClick={seek}
              className="group/bar relative h-1.5 cursor-pointer rounded-full bg-white/15"
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(251,191,36,0.35)] opacity-0 transition group-hover/bar:opacity-100"
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-3 text-zinc-200">
              <div className="flex items-center gap-2">
                <button onClick={() => setPlaying(!playing)} className="rounded-lg p-2 hover:bg-white/10">
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <div className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/10">
                  <Volume2 className="h-4 w-4" />
                  <input
                    type="range" min={0} max={1} step={0.05} value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="h-1 w-20 cursor-pointer accent-amber-400"
                  />
                </div>
                <span className="ml-1 text-xs tabular-nums text-zinc-300">
                  {fmt(progress * 0.14)} <span className="text-zinc-500">/ 14:21</span>
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCaptions(!captions)}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs hover:bg-white/10",
                    captions && "text-amber-200",
                  )}
                >
                  <Captions className="h-4 w-4" /> CC
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs hover:bg-white/10"
                  >
                    <Gauge className="h-4 w-4" /> {speed}x
                  </button>
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        className="absolute bottom-10 right-0 w-44 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 p-2 text-xs shadow-2xl backdrop-blur"
                      >
                        <div className="px-2 pb-1 text-[10px] uppercase tracking-wider text-zinc-500">Playback speed</div>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => { setSpeed(s); setShowSettings(false); }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-white/10",
                              s === speed && "text-amber-300",
                            )}
                          >
                            <span>{s}x</span>
                            {s === speed && <CircleCheck className="h-3.5 w-3.5" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button className="rounded-lg p-2 hover:bg-white/10"><PictureInPicture2 className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 hover:bg-white/10"><Settings2 className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 hover:bg-white/10"><Maximize2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

function fmt(min: number) {
  const m = Math.floor(min);
  const s = Math.floor((min - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ---------------- TAB PANES ---------------- */
function OverviewPane() {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_280px]">
      <div className="space-y-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-amber-300/80">About this lesson</div>
          <h2 className="mt-2 font-serif text-2xl">Conditional types — pattern, inference, payoff</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">
            Learn how conditional types let TypeScript branch at the type level, how `infer` captures pieces of a type for reuse,
            and the three patterns you'll reach for in real codebases — distributive unions, helper utilities, and inference-driven APIs.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { k: "Duration", v: "14:21" },
            { k: "Lessons left", v: "8" },
            { k: "Difficulty", v: "Advanced" },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">{s.k}</div>
              <div className="mt-1 font-serif text-lg text-amber-100">{s.v}</div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-zinc-200">What you'll learn</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              "When to reach for conditional types",
              "How `infer` enables type extraction",
              "Distributive vs non-distributive forms",
              "Building tiny inference helpers",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-zinc-300">
                <CircleCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="space-y-3 rounded-xl border border-white/10 bg-gradient-to-b from-amber-400/10 to-transparent p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 font-serif text-white">SL</div>
          <div>
            <div className="text-sm font-semibold">Sarah Lin</div>
            <div className="text-xs text-zinc-400">Principal Engineer · Stripe</div>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-zinc-400">
          12+ years of typed JavaScript. Author of "Practical TypeScript Patterns".
        </p>
        <div className="flex items-center gap-3 text-xs text-zinc-300">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-300" /> 4.9</span>
          <span>·</span>
          <span>1,284 students</span>
        </div>
        <button className="mt-2 w-full rounded-lg border border-amber-300/30 bg-amber-300/10 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-300/20">
          View instructor
        </button>
      </aside>
    </div>
  );
}

function ResourcesPane() {
  return (
    <div className="space-y-2">
      {RESOURCES.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-amber-300/30 hover:bg-amber-300/5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-rose-500/20 text-amber-200">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-100">{r.name}</div>
              <div className="text-xs text-zinc-500">{r.type} · {r.size}</div>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition group-hover:border-amber-300/40 group-hover:text-amber-200">
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </motion.div>
      ))}
    </div>
  );
}

function QuizPane() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(
    () => QUIZ.reduce((acc, q, i) => acc + (answers[i] === q.a ? 1 : 0), 0),
    [answers],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-r from-amber-400/10 to-rose-500/10 p-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-amber-300/80">Module quiz</div>
          <div className="font-serif text-lg">Conditional types — 3 questions</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Score</div>
          <div className="font-serif text-2xl text-amber-200">{submitted ? `${score}/${QUIZ.length}` : "—"}</div>
        </div>
      </div>
      {QUIZ.map((q, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-sm font-semibold text-zinc-100">
            <span className="mr-2 text-amber-300">Q{i + 1}.</span>
            {q.q}
          </div>
          <div className="grid gap-2">
            {q.opts.map((o, j) => {
              const picked = answers[i] === j;
              const correct = submitted && j === q.a;
              const wrong = submitted && picked && j !== q.a;
              return (
                <button
                  key={j}
                  onClick={() => !submitted && setAnswers((a) => ({ ...a, [i]: j }))}
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition",
                    picked && !submitted && "border-amber-300/50 bg-amber-300/10 text-amber-100",
                    !picked && !submitted && "border-white/10 bg-white/[0.02] text-zinc-300 hover:border-white/20",
                    correct && "border-emerald-400/50 bg-emerald-400/10 text-emerald-100",
                    wrong && "border-rose-400/50 bg-rose-400/10 text-rose-100",
                  )}
                >
                  <span>{o}</span>
                  {correct && <CircleCheck className="h-4 w-4 text-emerald-300" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < QUIZ.length}
          className="rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitted ? "Submitted" : "Submit attempt"}
        </button>
        {submitted && (
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="text-xs text-zinc-400 hover:text-zinc-200">
            Retake quiz
          </button>
        )}
      </div>
    </div>
  );
}

function DiscussionPane() {
  const [text, setText] = useState("");
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-xs font-bold text-white">AS</div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask a question or share an insight…"
            rows={2}
            className="w-full resize-none bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <MessageCircle className="h-3.5 w-3.5" /> Be kind — instructors and peers are watching.
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-rose-400 px-3 py-1.5 text-xs font-semibold text-zinc-950">
              <Send className="h-3.5 w-3.5" /> Post
            </button>
          </div>
        </div>
      </div>
      {DISCUSSION.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white",
              d.role === "Instructor" ? "bg-gradient-to-br from-amber-400 to-rose-500" : "bg-gradient-to-br from-indigo-500 to-violet-500",
            )}>
              {d.user.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-100">{d.user}</span>
                {d.role === "Instructor" && (
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-200">Instructor</span>
                )}
                <span className="text-xs text-zinc-500">· {d.time}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{d.text}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400">
            <button className="flex items-center gap-1 hover:text-amber-200"><ThumbsUp className="h-3.5 w-3.5" /> {d.likes}</button>
            <button className="flex items-center gap-1 hover:text-amber-200"><MessageCircle className="h-3.5 w-3.5" /> {d.replies} replies</button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function NotesPane() {
  const [note, setNote] = useState(
    "• `infer` captures a slice of a type for reuse inside a conditional\n• Use distributive unions to fan out logic, wrap in [] to opt out\n• Helper pattern: type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T",
  );
  const stamps = ["02:14", "04:48", "09:02"];
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_220px]">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <NotebookPen className="h-4 w-4 text-amber-300" /> Personal notes
          </div>
          <span className="text-xs text-zinc-500">Autosaved · just now</span>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={14}
          className="w-full rounded-xl border border-white/10 bg-zinc-950/60 p-4 font-mono text-sm leading-relaxed text-zinc-200 focus:border-amber-300/40 focus:outline-none"
        />
      </div>
      <aside className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500">Timestamps</div>
        {stamps.map((s) => (
          <button key={s} className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-left text-xs text-zinc-300 transition hover:border-amber-300/30 hover:text-amber-200">
            <span className="font-mono">{s}</span>
            <Play className="h-3 w-3" />
          </button>
        ))}
        <div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-300/5 p-3 text-xs text-amber-100/90">
          <Mic className="mb-1 h-3.5 w-3.5" />
          Try voice notes in the next release.
        </div>
      </aside>
    </div>
  );
}

/* ---------------- CURRICULUM ROW ---------------- */
function ModuleRow({ module: m, index, open, onToggle }: { module: Module; index: number; open: boolean; onToggle: () => void }) {
  const done = m.lessons.filter((l) => l.done).length;
  const pct = Math.round((done / m.lessons.length) * 100);
  return (
    <div className="overflow-hidden rounded-xl">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-zinc-100 dark:hover:bg-white/5"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-amber-300/15 to-rose-400/10 font-serif text-sm text-amber-200">
          {index.toString().padStart(2, "0")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-zinc-100">{m.title}</span>
            <span className="text-[10px] text-zinc-500">{m.minutes} min</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] tabular-nums text-zinc-500">{done}/{m.lessons.length}</span>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 90 : 0 }} className="text-zinc-500">
          <ChevronRight className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-1 px-2 pb-3">
              {m.lessons.map((l) => <LessonRow key={l.id} lesson={l} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonRow({ lesson: l }: { lesson: Lesson }) {
  const Icon = l.type === "quiz" ? Trophy : l.type === "reading" ? BookOpen : Play;
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition",
        l.active && "border-amber-300/30 bg-amber-300/10",
        !l.active && !l.locked && "hover:bg-zinc-100 dark:hover:bg-white/5",
        l.locked && "opacity-50",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border text-xs",
          l.done && "border-amber-300/40 bg-amber-300/10 text-amber-200",
          l.active && "border-amber-300/60 bg-amber-300/20 text-amber-100",
          !l.done && !l.active && "border-white/10 bg-white/[0.03] text-zinc-400",
        )}
      >
        {l.locked ? <Lock className="h-3 w-3" /> : l.done ? <CircleCheck className="h-3.5 w-3.5" /> : <Icon className="h-3 w-3" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-xs", l.active ? "text-amber-100 font-medium" : "text-zinc-300")}>{l.title}</div>
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">{l.type} · {l.duration}</div>
      </div>
      {l.active && (
        <span className="flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-amber-300 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
      )}
    </div>
  );
}
