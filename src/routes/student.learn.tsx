import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/student/learn")({ component: ContinueLearning });

const current = {
  title: "Advanced TypeScript: Conditional Types",
  course: "Advanced TypeScript",
  instructor: "Sarah Lin",
  progress: 64,
  remaining: "12 min remaining",
};

const upNext = [
  { title: "Infer keyword in depth", duration: "14:20", done: false },
  { title: "Template literal types", duration: "18:05", done: false },
  { title: "Recursive types", duration: "22:10", done: false },
];

const completed = [
  { title: "Generics basics", duration: "10:15" },
  { title: "Utility types", duration: "12:40" },
  { title: "Mapped types", duration: "16:00" },
];

function ContinueLearning() {
  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <h2 className="text-3xl font-light tracking-tight text-white font-serif">
          Continue <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">Learning</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">Pick up exactly where you left off.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-24 -right-16 h-72 w-72 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="h-40 w-full md:w-64 rounded-xl bg-gradient-to-br from-amber-500/30 to-zinc-950 flex items-center justify-center border border-amber-500/20">
            <PlayCircle className="h-14 w-14 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80">{current.course}</p>
            <h3 className="text-2xl font-semibold text-white mt-2">{current.title}</h3>
            <p className="text-sm text-zinc-400 mt-1">{current.instructor} · {current.remaining}</p>
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                <span>Lesson progress</span>
                <span className="text-amber-400">{current.progress}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${current.progress}%` }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                />
              </div>
            </div>
            <button className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors">
              <PlayCircle className="h-4 w-4" /> Resume
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">Up next</h3>
          <ul className="space-y-3">
            {upNext.map((l, i) => (
              <motion.li
                key={l.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-amber-500/20 transition-colors group cursor-pointer"
              >
                <Circle className="h-5 w-5 text-zinc-600 group-hover:text-amber-400" />
                <span className="flex-1 text-sm text-zinc-200">{l.title}</span>
                <span className="text-xs text-zinc-500 inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {l.duration}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">Completed</h3>
          <ul className="space-y-3">
            {completed.map((l, i) => (
              <motion.li
                key={l.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-lg"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="flex-1 text-sm text-zinc-400 line-through">{l.title}</span>
                <span className="text-xs text-zinc-600">{l.duration}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
