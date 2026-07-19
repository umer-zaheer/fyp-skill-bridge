import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Wallet,
  Star,
  TrendingUp,
  Video,
  MessageSquare,
  Plus,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
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
import {
  instructorCourses,
  instructorEarningsTrend,
  instructorEnrollmentTrend,
  instructorKpis,
  instructorLiveSessions,
  instructorReviews,
  instructorSales,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getChartTheme } from "@/lib/themeStyles";

export const Route = createFileRoute("/instructor/dashboard")({
  component: InstructorDashboard,
});

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function Card({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      custom={delay}
      variants={fadeUp}
      className={cn(
        "relative rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none backdrop-blur-sm overflow-hidden",
        "hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-colors duration-300",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  action,
}: {
  icon: LucideIcon;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function InstructorDashboard() {
  const { isDark } = useTheme();
  const chart = getChartTheme(isDark);
  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const kpis = [
    { label: "Total Students", value: fmt(instructorKpis.totalStudents.value), trend: instructorKpis.totalStudents.trend, icon: Users },
    { label: "Active Courses", value: String(instructorKpis.activeCourses.value), trend: instructorKpis.activeCourses.trend, icon: BookOpen },
    { label: "Monthly Earnings", value: usd(instructorKpis.monthlyEarnings.value), trend: instructorKpis.monthlyEarnings.trend, icon: Wallet },
    { label: "Avg. Rating", value: instructorKpis.avgRating.value.toFixed(2), trend: instructorKpis.avgRating.trend, icon: Star },
  ];

  const upcoming = instructorLiveSessions.filter((s) => s.status === "Upcoming").slice(0, 3);
  const unanswered = instructorReviews.filter((r) => !r.replied).slice(0, 3);
  const topCourses = [...instructorCourses].filter((c) => c.status === "Published").sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  return (
    <div className="space-y-6 text-zinc-700 dark:text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-24 -right-16 h-72 w-72 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-10 h-72 w-72 bg-violet-700/10 rounded-full blur-[120px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Instructor studio</p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900 dark:text-white font-serif">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-200 dark:to-amber-500 bg-clip-text text-transparent font-semibold">
                Sarah
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-lg">
              You have <span className="text-amber-400">{upcoming.length} live sessions</span> coming up and{" "}
              <span className="text-amber-400">{unanswered.length} reviews</span> waiting for a reply.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/instructor/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
            >
              <Plus className="h-4 w-4" />
              New course
            </Link>
            <Link
              to="/instructor/live"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 hover:border-amber-500/40 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-900 dark:text-white transition-colors"
            >
              <PlayCircle className="h-4 w-4 text-amber-500" />
              Go live
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <Card key={k.label} delay={i + 1} className="p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <k.icon className="h-5 w-5 text-amber-500" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                +{k.trend}%
              </span>
            </div>
            <p className="mt-5 text-xs uppercase tracking-wider text-zinc-500">{k.label}</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">{k.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card delay={5} className="lg:col-span-2 p-5">
          <SectionTitle icon={Wallet} title="Earnings" />
          <p className="text-xs text-zinc-500 -mt-3 mb-4">Last 12 months</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={instructorEarningsTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="instEarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  formatter={(v) => usd(Number(v))}
                />
                <Area type="monotone" dataKey="earnings" stroke="#e6c659" strokeWidth={2.5} fill="url(#instEarn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card delay={6} className="p-5">
          <SectionTitle icon={Users} title="New Enrollments" />
          <p className="text-xs text-zinc-500 -mt-3 mb-4">Per month</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={instructorEnrollmentTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card delay={7} className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-zinc-800/80">
            <SectionTitle
              icon={BookOpen}
              title="Top Courses"
              action={
                <Link to="/instructor/courses" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  Manage →
                </Link>
              }
            />
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
            {topCourses.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-5 text-xs font-semibold text-zinc-600">{i + 1}</span>
                <img src={c.thumb} alt="" className="h-10 w-14 rounded-md object-cover border border-zinc-800" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{c.title}</p>
                  <p className="text-xs text-zinc-500">{fmt(c.students)} students · {c.completion}% completion</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-400">{usd(c.revenue)}</p>
                  <p className="text-[11px] text-zinc-500 inline-flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {c.rating}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card delay={8} className="p-5">
          <SectionTitle
            icon={Video}
            title="Upcoming Live"
            action={
              <Link to="/instructor/live" className="text-xs text-amber-400 hover:text-amber-300">
                All →
              </Link>
            }
          />
          <ul className="space-y-3">
            {upcoming.map((s) => (
              <li key={s.id} className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50 p-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{s.title}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {s.date} · {s.time} · {s.duration}
                </p>
                <p className="text-[11px] text-amber-400 mt-2">
                  {s.attendees}/{s.capacity} registered
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card delay={9} className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-zinc-800/80">
            <SectionTitle
              icon={Wallet}
              title="Recent Sales"
              action={
                <Link to="/instructor/earnings" className="text-xs text-amber-400 hover:text-amber-300">
                  Earnings →
                </Link>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr className="border-b border-zinc-800/80">
                  <th className="text-left font-medium px-5 py-3">Student</th>
                  <th className="text-left font-medium px-5 py-3">Course</th>
                  <th className="text-left font-medium px-5 py-3">Amount</th>
                  <th className="text-left font-medium px-5 py-3">Date</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {instructorSales.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-white">{s.student}</td>
                    <td className="px-5 py-3 text-zinc-400">{s.course}</td>
                    <td className="px-5 py-3 text-white font-medium">{usd(s.amount)}</td>
                    <td className="px-5 py-3 text-zinc-500">{s.date}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex text-xs font-medium px-2 py-1 rounded-full border",
                          s.status === "Paid"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20",
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card delay={10} className="p-5">
          <SectionTitle
            icon={MessageSquare}
            title="Needs Reply"
            action={
              <Link to="/instructor/reviews" className="text-xs text-amber-400 hover:text-amber-300">
                Reviews →
              </Link>
            }
          />
          <ul className="space-y-4">
            {unanswered.map((r) => (
              <li key={r.id} className="relative pl-4 border-l border-amber-500/30">
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-white line-clamp-2">{r.body}</p>
                <p className="text-[11px] text-zinc-600 mt-1">
                  {r.student} · {r.course}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
