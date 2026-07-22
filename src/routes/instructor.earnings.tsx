import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Download, DollarSign, Clock, CheckCircle2, Filter, Link2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { instructorEarningsTrend, instructorPayouts, instructorSales } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getChartTheme } from "@/lib/themeStyles";
import {
  instructorEarnings,
  instructorStripeOnboard,
  instructorStripeStatus,
} from "@/lib/api/lms";
import { toast } from "sonner";

export const Route = createFileRoute("/instructor/earnings")({
  component: InstructorEarningsPage,
});

type PayoutFilter = "All" | "Paid" | "Pending";

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Refunded: "bg-red-500/10 text-red-400 border-red-500/20",
};

function InstructorEarningsPage() {
  const { isDark } = useTheme();
  const chart = getChartTheme(isDark);
  const [payoutFilter, setPayoutFilter] = useState<PayoutFilter>("All");
  const [liveTotal, setLiveTotal] = useState<number | null>(null);
  const [stripeReady, setStripeReady] = useState(false);
  const [connectEnabled, setConnectEnabled] = useState<boolean | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [earn, st] = await Promise.all([
          instructorEarnings(),
          instructorStripeStatus(),
        ]);
        setLiveTotal(earn.data?.total ?? 0);
        setStripeReady(Boolean(st.data?.stripeOnboardingComplete));
      } catch {
        /* keep mock */
      }
    })();

    const params = new URLSearchParams(window.location.search);
    if (params.get("stripe") === "return" || params.get("stripe") === "refresh") {
      (async () => {
        try {
          const st = await instructorStripeStatus();
          setStripeReady(Boolean(st.data?.stripeOnboardingComplete));
          if (st.data?.stripeOnboardingComplete) {
            toast.success("Stripe Connect ready — you can receive 80% payouts");
          } else if (params.get("stripe") === "return") {
            toast.message("Finish Stripe onboarding to enable destination payouts");
          }
        } catch {
          /* */
        } finally {
          window.history.replaceState({}, "", "/instructor/earnings");
        }
      })();
    }
  }, []);

  const connectStripe = async () => {
    setConnecting(true);
    try {
      const res = await instructorStripeOnboard();
      if (res.url) window.location.href = res.url;
      else toast.error("No Stripe onboarding URL returned");
    } catch (e: any) {
      const msg = e?.message || "Stripe Connect failed";
      toast.error(msg, { duration: 8000 });
      if (/Enable Stripe Connect/i.test(msg)) {
        setConnectEnabled(false);
      }
    } finally {
      setConnecting(false);
    }
  };

  const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const filteredPayouts = useMemo(
    () => instructorPayouts.filter((p) => payoutFilter === "All" || p.status === payoutFilter),
    [payoutFilter],
  );

  const available = instructorPayouts.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const paidYtd = liveTotal ?? instructorPayouts.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const monthSales = instructorSales.filter((s) => s.status === "Paid").reduce((s, p) => s + p.amount, 0);

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
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Payouts</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              Your{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                earnings
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              You receive 80% of each sale · platform keeps 20%. Stripe:{" "}
              <span className={stripeReady ? "text-emerald-400" : "text-amber-400"}>
                {stripeReady
                  ? "connected — destination payouts on"
                  : "not connected — sales go to platform until you connect"}
              </span>
            </p>
            <p className="mt-2 text-xs text-zinc-500 max-w-xl">
              First-time setup: enable Connect at{" "}
              <a
                href="https://dashboard.stripe.com/test/connect"
                target="_blank"
                rel="noreferrer"
                className="underline text-amber-300/90 hover:text-amber-200"
              >
                dashboard.stripe.com/test/connect
              </a>{" "}
              (Get started), then click Connect Stripe here.
            </p>
            {connectEnabled === false && (
              <p className="mt-2 text-xs text-amber-300/90 max-w-xl">
                Connect is still disabled on the platform Stripe account. Finish Get started in the
                dashboard, then try again.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={connecting}
              onClick={() => void connectStripe()}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-sm font-medium text-amber-200 transition-colors disabled:opacity-60"
            >
              <Link2 className="h-4 w-4" />
              {connecting ? "Opening…" : stripeReady ? "Stripe dashboard" : "Connect Stripe"}
            </button>
            <button className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-700 hover:border-amber-500/40 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-900 dark:text-white transition-colors">
              <Download className="h-4 w-4 text-amber-500" />
              Export statement
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Available for payout", value: usd(available), icon: Clock, hint: "Next transfer Jul 1" },
          { label: "Paid year-to-date", value: usd(paidYtd), icon: CheckCircle2, hint: "Bank + PayPal" },
          { label: "Recent sales", value: usd(monthSales), icon: DollarSign, hint: "This period" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
              <s.icon className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">{s.value}</p>
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
          <Wallet className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Earnings vs payouts</h3>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={instructorEarningsTrend}>
              <defs>
                <linearGradient id="earnG" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="earnings" stroke="#e6c659" strokeWidth={2} fill="url(#earnG)" />
              <Area type="monotone" dataKey="payouts" stroke="#a1a1aa" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Payout history</h3>
            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-zinc-500" />
              {(["All", "Paid", "Pending"] as PayoutFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setPayoutFilter(f)}
                  className={cn(
                    "px-2 py-1 text-[11px] rounded border",
                    payoutFilter === f
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      : "text-zinc-500 border-transparent hover:text-white",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
            {filteredPayouts.map((p) => (
              <li key={p.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{p.period}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {p.id} · {p.method} · {p.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-400">{usd(p.amount)}</p>
                  <span className={cn("inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded-full border mt-1", statusStyles[p.status])}>
                    {p.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800/80">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">Recent sales</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-zinc-500">
                <tr className="border-b border-zinc-800/80">
                  <th className="text-left font-medium px-5 py-3">Student</th>
                  <th className="text-left font-medium px-5 py-3">Course</th>
                  <th className="text-left font-medium px-5 py-3">Amount</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                {instructorSales.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-medium text-white">{s.student}</td>
                    <td className="px-5 py-3 text-zinc-400 truncate max-w-[140px]">{s.course}</td>
                    <td className="px-5 py-3 text-white">{usd(s.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-full border", statusStyles[s.status])}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
