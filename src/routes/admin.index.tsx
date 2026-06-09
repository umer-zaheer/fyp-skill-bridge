import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Plus,
  UserPlus,
  FolderPlus,
  BarChart3,
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
import KpiCard from "@/components/dashboard/KpiCard";
import {
  enrollmentTrends,
  kpis,
  monthlyRevenue,
  recentTransactions,
  recentUsers,
  topCourses,
} from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

type RevenueKey = "total" | "subscriptions" | "individual";

const revenueTabs: { key: RevenueKey; label: string }[] = [
  { key: "total", label: "Total" },
  { key: "subscriptions", label: "Subscriptions" },
  { key: "individual", label: "Individual Sales" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-700",
  Refunded: "bg-amber-50 text-amber-700",
  Failed: "bg-red-50 text-red-700",
};

function AdminDashboard() {
  const [revenueKey, setRevenueKey] = useState<RevenueKey>("total");
  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Students" value={fmt(kpis.totalStudents.value)} trend={kpis.totalStudents.trend} icon={Users} accent="bg-indigo-50 text-indigo-600" />
        <KpiCard label="Total Instructors" value={fmt(kpis.totalInstructors.value)} trend={kpis.totalInstructors.trend} icon={GraduationCap} accent="bg-violet-50 text-violet-600" />
        <KpiCard label="Total Courses" value={fmt(kpis.totalCourses.value)} trend={kpis.totalCourses.trend} icon={BookOpen} accent="bg-sky-50 text-sky-600" />
        <KpiCard label="Total Revenue" value={usd(kpis.totalRevenue.value)} trend={kpis.totalRevenue.trend} icon={DollarSign} accent="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue area chart */}
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-slate-100 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Revenue</h3>
              <p className="text-xs text-slate-500">Last 12 months</p>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1">
              {revenueTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setRevenueKey(t.key)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    revenueKey === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(v) => usd(Number(v))}
                />
                <Area type="monotone" dataKey={revenueKey} stroke="#6366F1" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollment trends */}
        <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-5">
          <h3 className="text-base font-semibold text-slate-900">New Enrollments</h3>
          <p className="text-xs text-slate-500">Per month</p>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="enrollments" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent transactions + Top courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Recent Transactions</h3>
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="text-left font-medium px-5 py-3">Student</th>
                  <th className="text-left font-medium px-5 py-3">Course / Plan</th>
                  <th className="text-left font-medium px-5 py-3">Type</th>
                  <th className="text-left font-medium px-5 py-3">Amount</th>
                  <th className="text-left font-medium px-5 py-3">Date</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-900">{t.student}</td>
                    <td className="px-5 py-3 text-slate-600">{t.course}</td>
                    <td className="px-5 py-3 text-slate-600">{t.type}</td>
                    <td className="px-5 py-3 text-slate-900 font-medium">{usd(t.amount)}</td>
                    <td className="px-5 py-3 text-slate-500">{t.date}</td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full", statusStyles[t.status] ?? "bg-slate-100 text-slate-700")}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm border border-slate-100">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">Top Performing Courses</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {topCourses.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-5 text-xs font-semibold text-slate-400">{i + 1}</span>
                <img src={c.thumb} alt={c.title} className="h-10 w-14 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{c.title}</p>
                  <p className="text-xs text-slate-500 truncate">{c.instructor} • {fmt(c.enrollments)} enrolled</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">{usd(c.revenue)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent users + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Recent Users</h3>
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Manage users</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="text-left font-medium px-5 py-3">User</th>
                  <th className="text-left font-medium px-5 py-3">Role</th>
                  <th className="text-left font-medium px-5 py-3">Joined</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
                          {u.avatar}
                        </div>
                        <span className="font-medium text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "inline-flex text-xs font-medium px-2 py-1 rounded-full",
                        u.role === "Instructor" ? "bg-violet-50 text-violet-700" : "bg-indigo-50 text-indigo-700",
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{u.joined}</td>
                    <td className="px-5 py-3">
                      <button
                        className={cn(
                          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                          u.status ? "bg-emerald-500" : "bg-slate-300",
                        )}
                      >
                        <span className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                          u.status ? "translate-x-4" : "translate-x-0.5",
                        )} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-5">
          <h3 className="text-base font-semibold text-slate-900">Quick Actions</h3>
          <p className="text-xs text-slate-500">Common admin tasks</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Add Course", icon: Plus },
              { label: "Add User", icon: UserPlus },
              { label: "New Category", icon: FolderPlus },
              { label: "View Reports", icon: BarChart3 },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex flex-col items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition-colors p-4 text-left"
              >
                <span className="h-8 w-8 rounded-md bg-white shadow-sm flex items-center justify-center text-indigo-600">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-900">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
