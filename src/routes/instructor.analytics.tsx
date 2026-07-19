import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Star, Target, BookOpen } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getChartTheme } from "@/lib/themeStyles";
import {
  instructorCoursePerformance,
  instructorEnrollmentTrend,
  instructorEarningsTrend,
  instructorWeeklyEngagement,
  instructorKpis,
} from "@/lib/mockData";

export const Route = createFileRoute("/instructor/analytics")({
  component: InstructorAnalyticsPage,
});

function InstructorAnalyticsPage() {
  const { isDark } = useTheme();
  const chart = getChartTheme(isDark);
  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const metrics = [
    { label: "Students", value: instructorKpis.totalStudents.value.toLocaleString(), trend: "+14%", icon: Users },
    { label: "Avg rating", value: instructorKpis.avgRating.value.toFixed(2), trend: "+2%", icon: Star },
    { label: "Completion", value: "75%", trend: "+5%", icon: Target },
    { label: "Live courses", value: String(instructorKpis.activeCourses.value), trend: "+1", icon: BookOpen },
  ];

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-20 right-0 h-64 w-64 bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Performance</p>
          <h2 className="text-3xl font-light tracking-tight text-white font-serif">
            Teaching{" "}
            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
              analytics
            </span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            Understand engagement, completion, and revenue across your courses.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-4"
          >
            <div className="flex items-center justify-between">
              <m.icon className="h-4 w-4 text-amber-500" />
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                {m.trend}
              </span>
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-zinc-500">{m.label}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Earnings trend</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={instructorEarningsTrend}>
                <defs>
                  <linearGradient id="iaEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  formatter={(v) => usd(Number(v))}
                />
                <Area type="monotone" dataKey="earnings" stroke="#e6c659" strokeWidth={2} fill="url(#iaEarn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Enrollments</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instructorEnrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  cursor={{ fill: "rgba(212,175,55,0.06)" }}
                />
                <Bar dataKey="enrollments" fill="#d4af37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
        >
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-4">Weekly engagement</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instructorWeeklyEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  cursor={{ fill: "rgba(212,175,55,0.06)" }}
                />
                <Bar dataKey="views" fill="#d4af37" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completions" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
        >
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-4">Course performance</h3>
          <ul className="space-y-4">
            {instructorCoursePerformance.map((c) => (
              <li key={c.course} className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{c.course}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {c.rating}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-zinc-500">Students</p>
                    <p className="text-white font-medium mt-0.5">{c.students.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Completion</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${c.completion}%` }} />
                      </div>
                      <span className="text-zinc-400">{c.completion}%</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
      >
        <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Thursday peak", body: "Lesson views peak on Thursdays — schedule live sessions then for max attendance." },
            { title: "Generics leads completion", body: "TypeScript Generics Masterclass has 81% completion — reuse its module length in new courses." },
            { title: "Node.js opportunity", body: "Node.js sits at 68% completion. Add mid-course checkpoints to lift finish rates." },
          ].map((t) => (
            <div key={t.title} className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50 p-4">
              <p className="text-sm font-medium text-amber-400">{t.title}</p>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
