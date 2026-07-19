import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Wallet,
  Link2,
  Save,
  Mail,
  Globe,
  Palette,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/components/theme/ThemeProvider";

export const Route = createFileRoute("/instructor/settings")({
  component: InstructorSettingsPage,
});

type Tab = "profile" | "payouts" | "notifications" | "social" | "appearance";

const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "social", label: "Social links", icon: Link2 },
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

function InstructorSettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("Sarah Lin");
  const [headline, setHeadline] = useState("Senior TypeScript Engineer & Educator");
  const [bio, setBio] = useState(
    "I teach modern TypeScript and Node.js with a focus on production patterns and clear mental models.",
  );
  const [email, setEmail] = useState("sarah.lin@skillbridge.io");
  const [timezone, setTimezone] = useState("America/New_York");

  const [payoutMethod, setPayoutMethod] = useState("bank");
  const [accountName, setAccountName] = useState("Sarah Lin");
  const [iban, setIban] = useState("•••• •••• •••• 4821");

  const [newEnrollment, setNewEnrollment] = useState(true);
  const [newReview, setNewReview] = useState(true);
  const [payoutAlert, setPayoutAlert] = useState(true);
  const [liveReminder, setLiveReminder] = useState(true);

  const [website, setWebsite] = useState("https://sarahlin.dev");
  const [twitter, setTwitter] = useState("@sarahlin");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/sarahlin");
  const [youtube, setYoutube] = useState("");

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
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Account</p>
            <h2 className="text-3xl font-light tracking-tight text-white font-serif">
              Instructor{" "}
              <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
                settings
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400">Manage your public profile, payouts, and alerts.</p>
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
          {tab === "profile" && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Public profile</h3>
              <p className="text-xs text-zinc-500 mb-2">Shown on your instructor page and course cards.</p>
              <Field label="Display name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
              <Field label="Headline" hint="One-line expertise summary.">
                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
              <Field label="Bio">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40 resize-none"
                />
              </Field>
              <Field label="Email">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                  />
                </div>
              </Field>
              <Field label="Timezone">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="Asia/Karachi">Asia/Karachi</option>
                  <option value="UTC">UTC</option>
                </select>
              </Field>
            </div>
          )}

          {tab === "payouts" && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Payout method</h3>
              <p className="text-xs text-zinc-500 mb-2">Where Skill Bridge sends your earnings.</p>
              <Field label="Method">
                <div className="flex gap-2">
                  {[
                    { id: "bank", label: "Bank transfer" },
                    { id: "paypal", label: "PayPal" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayoutMethod(m.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm border transition-colors",
                        payoutMethod === m.id
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "border-zinc-800 text-zinc-400 hover:text-white",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Account name">
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
              <Field label={payoutMethod === "bank" ? "IBAN / Account" : "PayPal email"}>
                <input
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500/40"
                />
              </Field>
            </div>
          )}

          {tab === "notifications" && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Notifications</h3>
              <p className="text-xs text-zinc-500 mb-2">Choose what emails you receive.</p>
              {[
                { label: "New enrollments", hint: "When a student buys your course.", checked: newEnrollment, set: setNewEnrollment },
                { label: "New reviews", hint: "When someone rates your course.", checked: newReview, set: setNewReview },
                { label: "Payout updates", hint: "When a transfer is sent or fails.", checked: payoutAlert, set: setPayoutAlert },
                { label: "Live session reminders", hint: "1 hour before you go live.", checked: liveReminder, set: setLiveReminder },
              ].map((item) => (
                <Field key={item.label} label={item.label} hint={item.hint}>
                  <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-3">
                    <span className="text-sm text-zinc-300">Enabled</span>
                    <Toggle checked={item.checked} onChange={item.set} />
                  </div>
                </Field>
              ))}
            </div>
          )}

          {tab === "social" && (
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Social links</h3>
              <p className="text-xs text-zinc-500 mb-2">Displayed on your public instructor profile.</p>
              <Field label="Website">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                  />
                </div>
              </Field>
              <Field label="Twitter / X">
                <input
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
              <Field label="LinkedIn">
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/40"
                />
              </Field>
              <Field label="YouTube" hint="Optional channel URL.">
                <input
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@…"
                  className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40"
                />
              </Field>
            </div>
          )}

          {tab === "appearance" && <InstructorAppearanceTab />}
        </motion.div>
      </div>
    </div>
  );
}

function InstructorAppearanceTab() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white mb-1">Appearance</h3>
      <p className="text-xs text-zinc-500 mb-2">Color mode applies across the whole site.</p>
      <Field label="Color mode">
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
    </div>
  );
}
