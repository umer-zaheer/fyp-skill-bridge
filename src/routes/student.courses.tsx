import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Filter,
  Flame,
  GraduationCap,
  LayoutGrid,
  List,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Users,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courseImages } from "@/lib/defaultImages";
import { myEnrollments, verifyCheckoutSession } from "@/lib/api/lms";
import CourseChannel from "@/components/courses/CourseChannel";
import { toast } from "sonner";

export const Route = createFileRoute("/student/courses")({ component: MyCourses });

type Course = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  level: string;
  status: "In Progress" | "Completed" | "Not Started";
  progress: number;
  lessons: number;
  completed: number;
  rating: number;
  students: number;
  hours: number;
  color: string;
  icon: string;
  image: string;
};

const colors = [
  "from-amber-500 via-orange-500 to-rose-500",
  "from-fuchsia-500 via-purple-500 to-amber-500",
  "from-emerald-500 via-teal-500 to-amber-500",
  "from-indigo-500 via-blue-500 to-amber-500",
];

const categories = ["All", "Development", "Design", "Data", "Marketing", "Business"] as const;
const levels = ["All", "Beginner", "Intermediate", "Advanced"] as const;
const statuses = ["All", "In Progress", "Completed", "Not Started"] as const;

function mapEnrollment(e: any, i: number): Course {
  const c = e.course || {};
  const progress = e.progress ?? 0;
  const lessons = (c.modules || []).reduce(
    (n: number, m: any) => n + (m.lessons?.length || 0),
    0,
  );
  const completed = Math.round((progress / 100) * lessons);
  const status: Course["status"] =
    progress >= 100 ? "Completed" : progress > 0 ? "In Progress" : "Not Started";
  const levelRaw = c.level || "all";
  const level =
    levelRaw === "all"
      ? "Beginner"
      : levelRaw.charAt(0).toUpperCase() + levelRaw.slice(1);
  return {
    id: c._id,
    title: c.title || "Course",
    instructor: c.instructor?.name || "Instructor",
    category: c.category?.name || "General",
    level,
    status,
    progress,
    lessons: lessons || 4,
    completed,
    rating: c.rating || 0,
    students: c.studentsCount || 0,
    hours: Math.max(1, Math.round(lessons * 0.5)),
    color: colors[i % colors.length],
    icon: (c.title || "C").slice(0, 2).toUpperCase(),
    image: c.thumbnail?.url || courseImages.typescript,
  };
}

function MyCourses() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelCourseId, setChannelCourseId] = useState<string | null>(null);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [level, setLevel] = useState<(typeof levels)[number]>("All");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await myEnrollments();
        setAllCourses((res.data || []).map(mapEnrollment));
        if (res.data?.[0]?.course?._id) setChannelCourseId(res.data[0].course._id);
      } catch {
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Complete Stripe checkout on return (works even if webhook is delayed)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    const sessionId = params.get("session_id");
    if (checkout !== "success" || !sessionId) return;

    (async () => {
      try {
        await verifyCheckoutSession(sessionId);
        toast.success("Payment successful — you're enrolled!");
        const res = await myEnrollments();
        setAllCourses((res.data || []).map(mapEnrollment));
      } catch (e: any) {
        toast.error(e?.message || "Could not confirm payment");
      } finally {
        window.history.replaceState({}, "", "/student/courses");
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      allCourses.filter(
        (c) =>
          (category === "All" || c.category === category) &&
          (level === "All" || c.level === level) &&
          (status === "All" || c.status === status) &&
          (query === "" || c.title.toLowerCase().includes(query.toLowerCase()) || c.instructor.toLowerCase().includes(query.toLowerCase())),
      ),
    [category, level, status, query],
  );

  return (
    <div
      className="relative space-y-6 text-zinc-200"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      )}
      {!loading && (
      <>
      {/* Ambient bg */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-96 w-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -left-32 h-96 w-96 bg-indigo-700/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-500/80 mb-2 inline-flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Your library
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white font-serif leading-tight">
            My{" "}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent font-semibold">
              Courses
            </span>
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            {allCourses.length} enrolled · {allCourses.filter((c) => c.status === "Completed").length} completed · {allCourses.filter((c) => c.status === "In Progress").length} in progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses…"
              className="w-72 pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900/60 backdrop-blur border border-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 focus:bg-zinc-900/80 transition-colors"
            />
          </div>
          <div className="hidden md:flex p-1 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                view === "grid" ? "bg-amber-500/15 text-amber-400" : "text-zinc-500 hover:text-white",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-2 rounded-lg transition-colors",
                view === "list" ? "bg-amber-500/15 text-amber-400" : "text-zinc-500 hover:text-white",
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md p-4 flex flex-wrap items-center gap-4"
      >
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500">
          <Filter className="h-3.5 w-3.5 text-amber-500" /> Filters
        </div>
        <FilterGroup label="Category" options={[...categories]} value={category} onChange={(v) => setCategory(v as typeof category)} />
        <div className="h-5 w-px bg-zinc-800" />
        <FilterGroup label="Level" options={[...levels]} value={level} onChange={(v) => setLevel(v as typeof level)} />
        <div className="h-5 w-px bg-zinc-800" />
        <FilterGroup label="Status" options={[...statuses]} value={status} onChange={(v) => setStatus(v as typeof status)} />
        <div className="ml-auto text-xs text-zinc-500">
          Showing <span className="text-amber-400 font-medium">{filtered.length}</span> of {allCourses.length}
        </div>
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {view === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filtered.map((c, i) => (
              <CourseCard3D key={c.id} course={c} delay={i * 0.05} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {filtered.map((c, i) => (
              <CourseListRow key={c.id} course={c} delay={i * 0.04} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <BookOpen className="h-10 w-10 text-zinc-700 mx-auto" />
          <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">No courses found</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Enroll from the catalog — try coupons TS20, DEV10, DESIGN25.
          </p>
          <Link to="/courses" className="inline-block mt-4 text-amber-400 text-sm underline">
            Browse courses
          </Link>
        </div>
      )}

      {channelCourseId && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-serif text-white">Class channel</h3>
            <select
              value={channelCourseId}
              onChange={(e) => setChannelCourseId(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-white"
            >
              {allCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <CourseChannel courseId={channelCourseId} />
        </div>
      )}
      </>
      )}
    </div>
  );
}

// ---------- Subcomponents ----------

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:border-amber-500/40 hover:text-white transition-colors"
      >
        <span className="text-zinc-500">{label}:</span>
        <span className="text-amber-400">{value}</span>
        <ChevronDown className={cn("h-3 w-3 text-zinc-500 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 min-w-[12rem] rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/95 backdrop-blur-xl shadow-xl shadow-black/60 p-1"
          >
            {options.map((o) => (
              <button
                key={o}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(o);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors",
                  o === value
                    ? "bg-amber-500/10 text-amber-300"
                    : "text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-white",
                )}
              >
                {o}
                {o === value && <Check className="h-3.5 w-3.5 text-amber-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseCard3D({ course, delay }: { course: Course; delay: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      style={{ perspective: 1000 }}
    >
      <Tilt
        glareEnable
        glareMaxOpacity={0.18}
        glareColor="#d4af37"
        glarePosition="all"
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        transitionSpeed={1200}
        scale={1.02}
        className="rounded-2xl"
      >
        <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none backdrop-blur-sm transition-colors hover:border-amber-500/40 [transform-style:preserve-3d]">
          {/* Border glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15),transparent_60%)]" />

          {/* Thumbnail */}
          <div className="relative h-44 overflow-hidden bg-zinc-900">
            <img
              src={course.image}
              alt={course.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

            {/* Floating icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-5 bottom-4 [transform:translateZ(40px)]"
            >
              <div className="h-16 w-16 rounded-2xl bg-zinc-950/40 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-bold text-white font-serif">{course.icon}</span>
              </div>
            </motion.div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 [transform:translateZ(30px)]">
              <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full bg-zinc-950/70 text-amber-300 border border-amber-500/30 backdrop-blur">
                {course.status}
              </span>
              {course.status === "In Progress" && course.progress > 60 && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/40 backdrop-blur">
                  <Flame className="h-2.5 w-2.5" /> Hot
                </span>
              )}
            </div>

            <div className="absolute top-3 right-3 [transform:translateZ(30px)]">
              <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full bg-zinc-950/70 text-white/80 border border-white/20 backdrop-blur">
                {course.level}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="relative p-5 [transform:translateZ(20px)]">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
              <span>{course.category}</span>
              <span className="h-1 w-1 rounded-full bg-zinc-700" />
              <span className="inline-flex items-center gap-1 text-amber-400">
                <Star className="h-3 w-3 fill-amber-400" /> {course.rating}
              </span>
            </div>

            <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-amber-300 transition-colors leading-tight">
              {course.title}
            </h3>

            {/* Instructor */}
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[10px] font-bold text-zinc-950">
                {course.instructor.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-300 truncate">{course.instructor}</p>
                <p className="text-[10px] text-zinc-500 inline-flex items-center gap-2">
                  <span className="inline-flex items-center gap-1"><Users className="h-2.5 w-2.5" /> {course.students.toLocaleString()}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {course.hours}h</span>
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-zinc-400 mb-1.5">
                <span>{course.completed} / {course.lessons} lessons</span>
                <span className="text-amber-400 font-medium">{course.progress}%</span>
              </div>
              <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_linear_infinite]" style={{ backgroundSize: "200% 100%" }} />
                </motion.div>
              </div>
            </div>

            {/* CTA */}
            <Link to="/student/course/$id" params={{ id: course.id }} className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100/5 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 border border-amber-500/30 hover:border-amber-500 py-2.5 text-sm font-semibold transition-all group/btn">
              <PlayCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
              {course.status === "Completed" ? "Review" : course.status === "Not Started" ? "Start Course" : "Continue Learning"}
            </Link>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}

function CourseListRow({ course, delay }: { course: Course; delay: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none backdrop-blur-sm p-4 flex items-center gap-4 hover:border-amber-500/40 transition-colors"
    >
      <div className="relative h-16 w-24 shrink-0 rounded-xl overflow-hidden bg-zinc-900">
        <img src={course.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-zinc-950/30" />
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold font-serif drop-shadow">{course.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
          <span>{course.category}</span>
          <span>·</span>
          <span>{course.level}</span>
        </div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-amber-300 transition-colors truncate">{course.title}</p>
        <p className="text-xs text-zinc-500">{course.instructor}</p>
      </div>
      <div className="hidden md:block w-48">
        <div className="flex justify-between text-[11px] text-zinc-400 mb-1.5">
          <span>{course.progress}%</span>
          <span>{course.completed}/{course.lessons}</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>
      <span className="hidden sm:inline-flex text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
        {course.status}
      </span>
      <Link to="/student/course/$id" params={{ id: course.id }} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 text-zinc-950 px-3 py-2 text-xs font-semibold hover:bg-amber-400 transition-colors">
        <PlayCircle className="h-3.5 w-3.5" />
        Continue
      </Link>
    </motion.div>
  );
}
