import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Plus,
  UserPlus,
  FolderPlus,
  BarChart3,
  TrendingUp,
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
  enrollmentTrends,
  kpis,
  monthlyRevenue,
  recentTransactions,
  recentUsers,
  topCourses,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getChartTheme } from "@/lib/themeStyles";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

type RevenueKey = "total" | "subscriptions" | "individual";

const revenueTabs: { key: RevenueKey; label: string }[] = [
  { key: "total", label: "Total" },
  { key: "subscriptions", label: "Subscriptions" },
  { key: "individual", label: "Individual Sales" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Refunded: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Failed: "bg-red-500/10 text-red-400 border border-red-500/20",
};

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

function AdminDashboard() {
  const { isDark } = useTheme();
  const chart = getChartTheme(isDark);
  const [revenueKey, setRevenueKey] = useState<RevenueKey>("total");
  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const kpiCards = [
    { label: "Total Students", value: fmt(kpis.totalStudents.value), trend: kpis.totalStudents.trend, icon: Users },
    { label: "Total Instructors", value: fmt(kpis.totalInstructors.value), trend: kpis.totalInstructors.trend, icon: GraduationCap },
    { label: "Total Courses", value: fmt(kpis.totalCourses.value), trend: kpis.totalCourses.trend, icon: BookOpen },
    { label: "Total Revenue", value: usd(kpis.totalRevenue.value), trend: kpis.totalRevenue.trend, icon: DollarSign },
  ];

  return (
    <div className="space-y-6 text-zinc-700 dark:text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-24 -right-16 h-72 w-72 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-10 h-72 w-72 bg-indigo-700/10 rounded-full blur-[120px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Admin overview</p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900 dark:text-white font-serif">
              Platform{" "}
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-200 dark:to-amber-500 bg-clip-text text-transparent font-semibold">
                health
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-lg">
              Revenue is up <span className="text-amber-400">23%</span> this month. {fmt(kpis.totalStudents.value)} learners across {fmt(kpis.totalCourses.value)} courses.
            </p>
          </div>
          <Link
            to="/admin/analytics"
            className="group inline-flex items-center gap-2 self-start md:self-auto rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
          >
            <BarChart3 className="h-4 w-4" />
            View analytics
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((k, i) => (
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
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-500" />
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Revenue</h3>
                <p className="text-xs text-zinc-500">Last 12 months</p>
              </div>
            </div>
            <div className="flex rounded-lg bg-zinc-950/80 border border-zinc-800 p-1">
              {revenueTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setRevenueKey(t.key)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    revenueKey === t.key
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                      : "text-zinc-500 hover:text-white border border-transparent",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey={revenueKey} stroke="#e6c659" strokeWidth={2.5} fill="url(#adminRevGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card delay={6} className="p-5">
          <SectionTitle icon={Users} title="New Enrollments" />
          <p className="text-xs text-zinc-500 -mt-3 mb-4">Per month</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
          <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between">
            <SectionTitle
              icon={DollarSign}
              title="Recent Transactions"
              action={
                <Link to="/admin/payments" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  View all →
                </Link>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr className="border-b border-zinc-800/80">
                  <th className="text-left font-medium px-5 py-3">Student</th>
                  <th className="text-left font-medium px-5 py-3">Course / Plan</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-left font-medium px-5 py-3">Amount</th>
                  <th className="text-left font-medium px-5 py-3">Date</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-white">{t.student}</td>
                    <td className="px-5 py-3 text-zinc-400">{t.course}</td>
                    <td className="px-5 py-3 text-zinc-400">{t.type}</td>
                    <td className="px-5 py-3 text-white font-medium">{usd(t.amount)}</td>
                    <td className="px-5 py-3 text-zinc-500">{t.date}</td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full", statusStyles[t.status] ?? "bg-zinc-800 text-zinc-300")}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card delay={8}>
          <div className="px-5 py-4 border-b border-zinc-800/80">
            <SectionTitle icon={BookOpen} title="Top Courses" />
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
            {topCourses.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-5 text-xs font-semibold text-zinc-600">{i + 1}</span>
                <img src={c.thumb} alt={c.title} className="h-10 w-14 rounded-md object-cover border border-zinc-800" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{c.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{c.instructor} · {fmt(c.enrollments)}</p>
                </div>
                <span className="text-sm font-semibold text-amber-400">{usd(c.revenue)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card delay={9} className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between">
            <SectionTitle
              icon={Users}
              title="Recent Users"
              action={
                <Link to="/admin/users" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  Manage users →
                </Link>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr className="border-b border-zinc-800/80">
                  <th className="text-left font-medium px-5 py-3">User</th>
                  <th className="text-left font-medium px-5 py-3">Role</th>
                  <th className="text-left font-medium px-5 py-3">Joined</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-semibold text-zinc-900">
                          {u.avatar}
                        </div>
                        <span className="font-medium text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex text-xs font-medium px-2 py-1 rounded-full border",
                          u.role === "Instructor"
                            ? "bg-violet-500/10 text-violet-300 border-violet-500/20"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/20",
                        )}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-500">{u.joined}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                          u.status ? "bg-emerald-500" : "bg-zinc-700",
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            u.status ? "translate-x-4" : "translate-x-0.5",
                          )}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card delay={10} className="p-5">
          <SectionTitle icon={Plus} title="Quick Actions" />
          <p className="text-xs text-zinc-500 -mt-3 mb-4">Common admin tasks</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Course", icon: Plus, to: "/admin/courses" as const },
              { label: "Add User", icon: UserPlus, to: "/admin/users" as const },
              { label: "New Category", icon: FolderPlus, to: "/admin/courses" as const },
              { label: "View Reports", icon: BarChart3, to: "/admin/analytics" as const },
            ].map(({ label, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-start gap-2 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/50 hover:bg-amber-500/5 hover:border-amber-500/30 transition-colors p-4 text-left"
              >
                <span className="h-8 w-8 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">{label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
