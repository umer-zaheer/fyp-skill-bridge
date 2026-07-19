import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Target,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getChartTheme } from "@/lib/themeStyles";
import {
  completionByCategory,
  dailyActiveUsers,
  enrollmentTrends,
  monthlyRevenue,
  trafficBySource,
} from "@/lib/mockData";

export const Route = createFileRoute("/admin/analytics")({ component: AdminAnalyticsPage });

const PIE_COLORS = ["#d4af37", "#a78bfa", "#34d399", "#38bdf8", "#f472b6"];

function AdminAnalyticsPage() {
  const { isDark } = useTheme();
  const chart = getChartTheme(isDark);
  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const metrics = [
    { label: "Avg. session", value: "24m", trend: "+8%", icon: Clock },
    { label: "Completion rate", value: "68%", trend: "+3%", icon: Target },
    { label: "DAU", value: "2,210", trend: "+12%", icon: Users },
    { label: "Courses live", value: "342", trend: "+8%", icon: BookOpen },
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
          <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Insights</p>
          <h2 className="text-3xl font-light tracking-tight text-white font-serif">
            Platform{" "}
            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
              analytics
            </span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl">
            Engagement, acquisition, and learning outcomes across the last 12 months.
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
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Revenue vs enrollments</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue.map((m, i) => ({ ...m, enrollments: enrollmentTrends[i].enrollments }))}>
                <defs>
                  <linearGradient id="aRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="l" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis yAxisId="r" orientation="right" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  formatter={(v, name) => (name === "total" ? usd(Number(v)) : Number(v))}
                />
                <Area yAxisId="l" type="monotone" dataKey="total" stroke="#e6c659" strokeWidth={2} fill="url(#aRev)" name="total" />
                <Area yAxisId="r" type="monotone" dataKey="enrollments" stroke="#a1a1aa" strokeWidth={2} fill="transparent" name="enrollments" />
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
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Daily active users</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyActiveUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  cursor={{ fill: "rgba(212,175,55,0.06)" }}
                />
                <Bar dataKey="users" fill="#d4af37" radius={[6, 6, 0, 0]} />
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
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-4">Traffic by source</h3>
          <div className="flex items-center gap-6">
            <div className="h-52 w-52 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficBySource}
                    dataKey="visits"
                    nameKey="source"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {trafficBySource.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={chart.tooltip}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-2">
              {trafficBySource.map((t, i) => (
                <li key={t.source} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    {t.source}
                  </span>
                  <span className="font-medium text-white">{t.visits.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
        >
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-4">Completion by category</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionByCategory} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="category" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  formatter={(v) => `${v}%`}
                />
                <Bar dataKey="rate" fill="#d4af37" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
      >
        <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-4">Key takeaways</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Peak engagement", body: "Thursday sessions outperform the weekly average by 16% — schedule live classes then." },
            { title: "Organic growth", body: "Organic search is the top acquisition channel. Double down on SEO for course landing pages." },
            { title: "Completion gap", body: "Marketing courses lag at 55%. Add mid-course checkpoints and shorter modules." },
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
