import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CreditCard,
  Download,
  DollarSign,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  Filter,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminPayments, monthlyRevenue } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getChartTheme } from "@/lib/themeStyles";

export const Route = createFileRoute("/admin/payments")({ component: AdminPaymentsPage });

type StatusFilter = "All" | "Paid" | "Refunded" | "Failed";
type TypeFilter = "All" | "Individual" | "Subscription";

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Refunded: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

function AdminPaymentsPage() {
  const { isDark } = useTheme();
  const chart = getChartTheme(isDark);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [type, setType] = useState<TypeFilter>("All");

  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const filtered = useMemo(() => {
    return adminPayments.filter((p) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        p.student.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.item.toLowerCase().includes(q);
      const matchesStatus = status === "All" || p.status === status;
      const matchesType = type === "All" || p.type === type;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [query, status, type]);

  const paid = adminPayments.filter((p) => p.status === "Paid");
  const revenue = paid.reduce((s, p) => s + p.amount, 0);
  const refunded = adminPayments.filter((p) => p.status === "Refunded").reduce((s, p) => s + p.amount, 0);
  const failed = adminPayments.filter((p) => p.status === "Failed").length;
  const subs = adminPayments.filter((p) => p.type === "Subscription" && p.status === "Paid").length;

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-16 -left-10 h-56 w-56 bg-emerald-500/10 rounded-full blur-[90px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Billing</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              Payments &{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                revenue
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Track transactions, refunds, and subscription billing.</p>
          </div>
          <button className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-700 hover:border-amber-500/40 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-900 dark:text-white transition-colors">
            <Download className="h-4 w-4 text-amber-500" />
            Export CSV
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Collected", value: usd(revenue), icon: DollarSign, hint: "Successful charges" },
          { label: "Refunded", value: usd(refunded), icon: RefreshCcw, hint: "Returned to students" },
          { label: "Failed", value: String(failed), icon: AlertTriangle, hint: "Needs follow-up" },
          { label: "Active subs", value: String(subs), icon: CheckCircle2, hint: "This period" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
              <s.icon className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">{s.value}</p>
            <p className="mt-1 text-[11px] text-zinc-600">{s.hint}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Revenue trend</h3>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity={0.4} />
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
              <Area type="monotone" dataKey="total" stroke="#e6c659" strokeWidth={2} fill="url(#payGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none overflow-hidden">
        <div className="p-4 md:p-5 border-b border-zinc-800/80 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID, student, or item…"
              className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-500" />
            {(["All", "Paid", "Refunded", "Failed"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                  status === s
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    : "text-zinc-500 border-zinc-800 hover:text-white",
                )}
              >
                {s}
              </button>
            ))}
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TypeFilter)}
              className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/60 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
            >
              {(["All", "Individual", "Subscription"] as TypeFilter[]).map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All types" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr className="border-b border-zinc-800/80">
                <th className="text-left font-medium px-5 py-3">Transaction</th>
                <th className="text-left font-medium px-5 py-3">Student</th>
                <th className="text-left font-medium px-5 py-3">Item</th>
                <th className="text-left font-medium px-5 py-3">Type</th>
                <th className="text-left font-medium px-5 py-3">Method</th>
                <th className="text-left font-medium px-5 py-3">Amount</th>
                <th className="text-left font-medium px-5 py-3">Date</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.025 }}
                  className="hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3 font-mono text-xs text-amber-400/80">{p.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-white">{p.student}</p>
                    <p className="text-xs text-zinc-500">{p.email}</p>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{p.item}</td>
                  <td className="px-5 py-3 text-zinc-400">{p.type}</td>
                  <td className="px-5 py-3 text-zinc-400">{p.method}</td>
                  <td className="px-5 py-3 font-medium text-white">{usd(p.amount)}</td>
                  <td className="px-5 py-3 text-zinc-500">{p.date}</td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full border", statusStyles[p.status])}>
                      {p.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-zinc-500">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
