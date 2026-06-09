import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, CreditCard, Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/student/subscription")({ component: Subscription });

const plans = [
  {
    name: "Basic",
    price: 0,
    tagline: "For occasional learners",
    features: ["Access to free courses", "Community forums", "Limited quizzes"],
    cta: "Current free tier",
    highlight: false,
  },
  {
    name: "Pro",
    price: 19,
    tagline: "Most popular",
    features: ["Unlimited courses", "Certificates", "Offline downloads", "Priority support"],
    cta: "Current plan",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 49,
    tagline: "For teams & power users",
    features: ["Everything in Pro", "1:1 mentor hours", "Team dashboards", "Early access content"],
    cta: "Upgrade",
    highlight: false,
  },
];

const invoices = [
  { id: "INV-2026-006", date: "Jun 01, 2026", amount: 19, status: "Paid" },
  { id: "INV-2026-005", date: "May 01, 2026", amount: 19, status: "Paid" },
  { id: "INV-2026-004", date: "Apr 01, 2026", amount: 19, status: "Paid" },
  { id: "INV-2026-003", date: "Mar 01, 2026", amount: 19, status: "Paid" },
];

function Subscription() {
  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <h2 className="text-3xl font-light tracking-tight text-white font-serif">
          Your <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">Subscription</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">Manage your plan, billing, and invoices.</p>
      </div>

      {/* Current plan banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-24 -right-16 h-72 w-72 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80">Active plan</p>
            <h3 className="text-3xl font-light text-white font-serif mt-1">
              Pro <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">Membership</span>
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              $19 / month · Next renewal on <span className="text-amber-400">Jul 01, 2026</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:text-white">Cancel plan</button>
            <button className="px-4 py-2 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold hover:bg-amber-400">Upgrade</button>
          </div>
        </div>
      </motion.div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`relative rounded-2xl border p-6 ${
              p.highlight
                ? "border-amber-500/40 bg-gradient-to-br from-zinc-900 to-zinc-950"
                : "border-zinc-800/80 bg-zinc-900/60"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-2 right-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full bg-amber-500 text-zinc-950">
                <Sparkles className="h-3 w-3" /> Current
              </span>
            )}
            <h4 className="text-lg font-semibold text-white">{p.name}</h4>
            <p className="text-xs text-zinc-500 mt-1">{p.tagline}</p>
            <p className="mt-4">
              <span className="text-4xl font-light text-white">${p.price}</span>
              <span className="text-sm text-zinc-500">/mo</span>
            </p>
            <ul className="mt-5 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <Check className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-6 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                p.highlight
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 cursor-default"
                  : "border border-zinc-700 text-zinc-200 hover:bg-white/5"
              }`}
            >
              {p.cta}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Payment + invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">Payment method</h3>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950/50">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <CreditCard className="h-5 w-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Visa •••• 4242</p>
              <p className="text-xs text-zinc-500">Expires 08 / 2028</p>
            </div>
          </div>
          <button className="mt-3 w-full py-2 text-xs text-amber-400 hover:text-amber-300">Update payment method</button>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-4">Billing history</h3>
          <div className="divide-y divide-zinc-800/80">
            {invoices.map((inv, i) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center gap-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white font-mono">{inv.id}</p>
                  <p className="text-xs text-zinc-500">{inv.date}</p>
                </div>
                <span className="text-sm text-zinc-300">${inv.amount}.00</span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {inv.status}
                </span>
                <button className="p-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-amber-400">
                  <Download className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
