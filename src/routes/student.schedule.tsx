import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Clock, Video } from "lucide-react";

export const Route = createFileRoute("/student/schedule")({ component: Schedule });

const events = [
  { day: "Mon", date: 9, title: "TypeScript: Generics Deep Dive", time: "4:00 PM", instructor: "Sarah Lin", type: "Live" },
  { day: "Tue", date: 10, title: "Design Systems Workshop", time: "11:00 AM", instructor: "Marco Reyes", type: "Live" },
  { day: "Wed", date: 11, title: "Quiz: Data Science Fundamentals", time: "2:30 PM", instructor: "Priya Nair", type: "Quiz" },
  { day: "Thu", date: 12, title: "Data Science: Regression Q&A", time: "6:30 PM", instructor: "Priya Nair", type: "Live" },
  { day: "Fri", date: 13, title: "Assignment Due: UX Research", time: "11:59 PM", instructor: "Sara Bennett", type: "Due" },
  { day: "Sat", date: 14, title: "Office Hours: React Performance", time: "10:00 AM", instructor: "James Cole", type: "Live" },
];

const typeColor: Record<string, string> = {
  Live: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Quiz: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  Due: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

function Schedule() {
  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-white font-serif">
            Your <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">Schedule</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Week of June 9 – 15, 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-sm text-zinc-300 hover:text-white">Week</button>
          <button className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-400">Month</button>
        </div>
      </div>

      {/* Mini week strip */}
      <div className="grid grid-cols-7 gap-2">
        {events.map((e, i) => (
          <motion.div
            key={e.day}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`rounded-xl p-3 text-center border ${
              i === 0
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-zinc-900/60 border-zinc-800"
            }`}
          >
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">{e.day}</p>
            <p className={`text-xl font-semibold mt-1 ${i === 0 ? "text-amber-300" : "text-white"}`}>{e.date}</p>
          </motion.div>
        ))}
        {/* Pad for 7 columns visually */}
        <div className="rounded-xl p-3 text-center border bg-zinc-900/60 border-zinc-800">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Sun</p>
          <p className="text-xl font-semibold mt-1 text-white">15</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">This week</h3>
        <ul className="divide-y divide-zinc-800/80">
          {events.map((e, i) => (
            <motion.li
              key={e.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center gap-4 py-4 group"
            >
              <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase text-amber-400/70">{e.day}</span>
                <span className="text-sm font-semibold text-amber-300">{e.date}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-amber-300 transition-colors">{e.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5 inline-flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {e.time} · {e.instructor}
                </p>
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full border ${typeColor[e.type]}`}>
                {e.type}
              </span>
              <button className="ml-2 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-amber-400 transition-colors">
                <Video className="h-3.5 w-3.5" /> Join
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
