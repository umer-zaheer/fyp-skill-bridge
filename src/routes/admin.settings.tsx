import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Save,
  Mail,
  Lock,
  Moon,
  Sun,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";
import {
  platformStripeConnect,
  platformStripeDisconnect,
  platformStripeStatus,
} from "@/lib/api/lms";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettingsPage });

type Tab = "general" | "notifications" | "security" | "billing" | "appearance";

const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
  { id: "general", label: "General", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-amber-500" : "bg-zinc-700",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function StripePlatformPanel() {
  const [status, setStatus] = useState<{
    stripeConnected?: boolean;
    stripeConfigured?: boolean;
    platformFeePercent?: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      const res = await platformStripeStatus();
      setStatus(res.data);
    } catch {
      setStatus(null);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const connect = async () => {
    setBusy(true);
    try {
      await platformStripeConnect(20);
      toast.success("Platform Stripe connected (80/20 marketplace enabled)");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message || "Connect failed — add STRIPE_SECRET_KEY to backend .env");
    } finally {
      setBusy(false);
    }
  };

  const disconnect = async () => {
    setBusy(true);
    try {
      await platformStripeDisconnect();
      toast.success("Platform Stripe disconnected — checkout paused");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message || "Disconnect failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field
      label="Stripe marketplace"
      hint="Connect to enable course checkout. Instructors still onboard their own Connect accounts to receive 80%."
    >
      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-900 dark:text-white">
              Status:{" "}
              <span
                className={
                  status?.stripeConnected ? "text-emerald-500" : "text-amber-500"
                }
              >
                {status?.stripeConnected ? "Connected" : "Disconnected"}
              </span>
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Keys configured: {status?.stripeConfigured ? "yes" : "no"} · Fee:{" "}
              {status?.platformFeePercent ?? 20}% platform /{" "}
              {100 - (status?.platformFeePercent ?? 20)}% instructor
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy || status?.stripeConnected}
              onClick={() => void connect()}
              className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-zinc-950 disabled:opacity-40"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
            </button>
            <button
              type="button"
              disabled={busy || !status?.stripeConnected}
              onClick={() => void disconnect()}
              className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-300 disabled:opacity-40"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </Field>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 py-5 border-b border-zinc-800/60 last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-white">{label}</p>
        {hint && <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{hint}</p>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

function AdminSettingsPage() {
  const [tab, setTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  const [platformName, setPlatformName] = useState("Skill Bridge");
  const [supportEmail, setSupportEmail] = useState("support@skillbridge.io");
  const [locale, setLocale] = useState("en-US");
  const [timezone, setTimezone] = useState("UTC");

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [modAlerts, setModAlerts] = useState(true);

  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [ipAllowlist, setIpAllowlist] = useState("");

  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState("0");

  const [accent, setAccent] = useState("amber");
  const [compactNav, setCompactNav] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-16 -right-8 h-48 w-48 bg-amber-500/10 rounded-full blur-[80px]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Configuration</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              Platform{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                settings
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Manage branding, security, billing, and notifications.</p>
          </div>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 self-start rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <nav className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-2 h-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5 md:p-6"
        >
          {tab === "general" && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">General</h3>
              <p className="text-xs text-zinc-500 mb-2">Core platform identity and locale.</p>
              <Field label="Platform name" hint="Shown in the sidebar and emails.">
                <input
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
              <Field label="Support email" hint="Public contact for learners.">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                  />
                </div>
              </Field>
              <Field label="Locale">
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                </select>
              </Field>
              <Field label="Timezone">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Karachi">Asia/Karachi</option>
                </select>
              </Field>
            </div>
          )}

          {tab === "notifications" && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Notifications</h3>
              <p className="text-xs text-zinc-500 mb-2">How admins are alerted about platform events.</p>
              <Field label="Email notifications" hint="Enrollment spikes, refunds, and system alerts.">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-3">
                  <span className="text-sm text-zinc-300">Enabled</span>
                  <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
                </div>
              </Field>
              <Field label="Push notifications">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-3">
                  <span className="text-sm text-zinc-300">Browser push</span>
                  <Toggle checked={pushNotifs} onChange={setPushNotifs} />
                </div>
              </Field>
              <Field label="Weekly digest" hint="Summary of KPIs every Monday morning.">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-3">
                  <span className="text-sm text-zinc-300">Send digest</span>
                  <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
                </div>
              </Field>
              <Field label="Moderation alerts" hint="Instant email on Critical / High queue items.">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-3">
                  <span className="text-sm text-zinc-300">Alert on severity High+</span>
                  <Toggle checked={modAlerts} onChange={setModAlerts} />
                </div>
              </Field>
            </div>
          )}

          {tab === "security" && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Security</h3>
              <p className="text-xs text-zinc-500 mb-2">Protect admin accounts and sessions.</p>
              <Field label="Two-factor auth" hint="Require 2FA for all admin roles.">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-3">
                  <span className="text-sm text-zinc-300 inline-flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-500" /> Enforce 2FA
                  </span>
                  <Toggle checked={twoFactor} onChange={setTwoFactor} />
                </div>
              </Field>
              <Field label="Session timeout" hint="Minutes of inactivity before logout.">
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="120">2 hours</option>
                </select>
              </Field>
              <Field label="IP allowlist" hint="Comma-separated IPs. Leave blank to allow all.">
                <textarea
                  value={ipAllowlist}
                  onChange={(e) => setIpAllowlist(e.target.value)}
                  rows={3}
                  placeholder="203.0.113.10, 198.51.100.25"
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40 resize-none"
                />
              </Field>
            </div>
          )}

          {tab === "billing" && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Billing</h3>
              <p className="text-xs text-zinc-500 mb-2">
                Platform Stripe marketplace — 20% admin / 80% instructor per course sale.
              </p>
              <StripePlatformPanel />
              <Field label="Currency">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — Pound</option>
                  <option value="PKR">PKR — Rupee</option>
                </select>
              </Field>
              <Field label="Default tax rate (%)">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
            </div>
          )}

          {tab === "appearance" && (
            <AppearanceTab
              accent={accent}
              setAccent={setAccent}
              compactNav={compactNav}
              setCompactNav={setCompactNav}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function AppearanceTab({
  accent,
  setAccent,
  compactNav,
  setCompactNav,
}: {
  accent: string;
  setAccent: (v: string) => void;
  compactNav: boolean;
  setCompactNav: (v: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Appearance</h3>
      <p className="text-xs text-zinc-500 mb-2">Admin dashboard look and feel.</p>
      <Field label="Color mode" hint="Applies across the whole site.">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { id: "light" as Theme, label: "Light", icon: Sun },
              { id: "dark" as Theme, label: "Dark", icon: Moon },
            ] as const
          ).map((opt) => {
            const Icon = opt.icon;
            const active = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                    : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </Field>
      <Field label="Accent color">
        <div className="flex gap-3">
          {[
            { id: "amber", swatch: "bg-amber-500" },
            { id: "violet", swatch: "bg-violet-500" },
            { id: "emerald", swatch: "bg-emerald-500" },
            { id: "sky", swatch: "bg-sky-500" },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setAccent(c.id)}
              className={cn(
                "h-10 w-10 rounded-full border-2 transition-transform",
                c.swatch,
                accent === c.id ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100",
              )}
              title={c.id}
            />
          ))}
        </div>
      </Field>
      <Field label="Compact navigation" hint="Collapse sidebar labels by default.">
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-3">
          <span className="text-sm text-zinc-300">Start collapsed</span>
          <Toggle checked={compactNav} onChange={setCompactNav} />
        </div>
      </Field>
    </div>
  );
}
