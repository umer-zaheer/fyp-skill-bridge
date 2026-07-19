import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
  Award,
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Megaphone,
  PlayCircle,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Video,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getChartTheme } from "@/lib/themeStyles";
import { courseImages } from "@/lib/defaultImages";

export const Route = createFileRoute("/student/dashboard")({
  component: StudentDashboard,
});

// ---------- Mock data ----------
const widgets: Array<{
  label: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  hint: string;
}> = [
  { label: "Courses Enrolled", value: "12", trend: "+2 this month", icon: BookOpen, hint: "active" },
  { label: "Hours Learned", value: "148", trend: "+12.4 this week", icon: Clock, hint: "h" },
  { label: "Certificates", value: "6", trend: "+1 awarded", icon: Award, hint: "earned" },
  { label: "Quiz Average", value: "92%", trend: "+4.2% vs last", icon: Trophy, hint: "score" },
];

const weeklyProgress = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 80 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 95 },
  { day: "Fri", minutes: 60 },
  { day: "Sat", minutes: 120 },
  { day: "Sun", minutes: 50 },
];

const activity = [
  { week: "W1", lessons: 8, quizzes: 2 },
  { week: "W2", lessons: 12, quizzes: 3 },
  { week: "W3", lessons: 6, quizzes: 1 },
  { week: "W4", lessons: 14, quizzes: 4 },
  { week: "W5", lessons: 10, quizzes: 3 },
  { week: "W6", lessons: 16, quizzes: 5 },
];

const upcomingClasses = [
  { title: "Advanced TypeScript: Generics Deep Dive", instructor: "Sarah Lin", time: "Today · 4:00 PM", duration: "60 min" },
  { title: "Design Systems Workshop", instructor: "Marco Reyes", time: "Tomorrow · 11:00 AM", duration: "90 min" },
  { title: "Data Science: Regression Live Q&A", instructor: "Priya Nair", time: "Thu · 6:30 PM", duration: "45 min" },
];

const announcements = [
  { title: "New course: React Server Components", body: "Just launched — explore the future of React rendering.", time: "2h ago" },
  { title: "Maintenance window Sunday", body: "Platform updates Sun 2–3 AM UTC. Brief downtime expected.", time: "1d ago" },
  { title: "Q3 Live Mentor Hours", body: "Book 1:1 sessions with top instructors. Limited slots.", time: "3d ago" },
];

const recommended = [
  { title: "Modern System Design", instructor: "James Cole", rating: 4.9, hours: 18, tag: "Trending", image: courseImages.systemDesign },
  { title: "Product Marketing Mastery", instructor: "Hannah Ortiz", rating: 4.8, hours: 12, tag: "New", image: courseImages.product },
  { title: "UX Research Sprint", instructor: "Sara Bennett", rating: 4.7, hours: 9, tag: "For you", image: courseImages.ux },
];

// ---------- Helpers ----------
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
        "relative rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none backdrop-blur-sm p-5 overflow-hidden",
        "hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-colors duration-300",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, action }: { icon: LucideIcon; title: string; action?: React.ReactNode }) {
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

// ---------- Page ----------
function StudentDashboard() {
  const { isDark } = useTheme();
  const chart = getChartTheme(isDark);
  return (
    <div
      className="space-y-6 text-zinc-700 dark:text-zinc-200"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Hero */}
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
            <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">
              Welcome back
            </p>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900 dark:text-white font-serif">
              Good evening,{" "}
              <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-200 dark:to-amber-500 bg-clip-text text-transparent font-semibold">
                Alex
              </span>
            </h2>
            <p className="mt-2 text-sm text-zinc-400 max-w-lg">
              You're on a 7-day streak. Pick up where you left off in <span className="text-amber-400">Advanced TypeScript</span>.
            </p>
          </div>
          <Link
            to="/student/learn"
            className="group inline-flex items-center gap-2 self-start md:self-auto rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors shadow-lg shadow-amber-500/20"
          >
            <PlayCircle className="h-4 w-4" />
            Continue learning
          </Link>
        </div>
      </motion.div>

      {/* Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((w, i) => (
          <Card key={w.label} delay={i + 1} className="hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <w.icon className="h-5 w-5 text-amber-500" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                {w.trend}
              </span>
            </div>
            <p className="mt-5 text-xs uppercase tracking-wider text-zinc-500">{w.label}</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">{w.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card delay={5}>
          <SectionTitle icon={TrendingUp} title="Weekly Progress" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgress} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  cursor={{ stroke: "#d4af37", strokeOpacity: 0.3 }}
                />
                <Area type="monotone" dataKey="minutes" stroke="#e6c659" strokeWidth={2} fill="url(#gradAmber)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card delay={6}>
          <SectionTitle icon={Sparkles} title="Learning Activity" />
          <div className="h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                <XAxis dataKey="week" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={chart.tooltip}
                  cursor={{ fill: "rgba(212,175,55,0.06)" }}
                />
                <Bar dataKey="lessons" fill="#d4af37" radius={[6, 6, 0, 0]} />
                <Bar dataKey="quizzes" fill="#a1a1aa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Upcoming + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card delay={7} className="lg:col-span-2">
          <SectionTitle
            icon={Calendar}
            title="Upcoming Classes"
            action={
              <Link to="/student/schedule" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                View schedule →
              </Link>
            }
          />
          <ul className="divide-y divide-zinc-800/80">
            {upcomingClasses.map((c, i) => (
              <motion.li
                key={c.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="flex items-center gap-4 py-3 group"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 flex items-center justify-center">
                  <Video className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate group-hover:text-amber-300 transition-colors">
                    {c.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {c.instructor} · {c.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-amber-400">{c.time}</p>
                  <Link
                    to="/student/schedule"
                    className="mt-1 inline-block text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    Join →
                  </Link>
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>

        <Card delay={8}>
          <SectionTitle icon={Megaphone} title="Announcements" />
          <ul className="space-y-4">
            {announcements.map((a, i) => (
              <motion.li
                key={a.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="relative pl-4 border-l border-amber-500/30"
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{a.title}</p>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{a.body}</p>
                <p className="text-[11px] text-zinc-600 mt-1.5">{a.time}</p>
              </motion.li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recommended */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white">
              Recommended for you
            </h3>
          </div>
          <Link to="/courses" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
            Browse catalog →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommended.map((r, i) => (
            <Link key={r.title} to="/courses/$id" params={{ id: String(i + 1) }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none hover:border-amber-500/40 transition-colors h-full"
              >
              <div className="relative h-32 overflow-hidden bg-zinc-900">
                <img
                  src={r.image}
                  alt={r.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full bg-zinc-950/70 text-amber-300 border border-amber-500/30">
                  {r.tag}
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-base font-semibold text-zinc-900 dark:text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {r.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-1">{r.instructor}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {r.rating}
                  </span>
                  <span className="text-zinc-500">{r.hours}h</span>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
