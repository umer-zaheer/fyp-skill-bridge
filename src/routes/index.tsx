import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

import Navbar from "@/components/layout/Navbar";
import { Spotlight } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  Star,
  Search,
  Code2,
  Palette,
  Briefcase,
  MonitorPlay,
  BrainCircuit,
  Globe,
  Database,
  LineChart,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { CustomCursor } from "@/components/ui/custom-cursor";

// --- DATA ---
const brands = ["Google", "Microsoft", "Amazon", "Netflix", "Meta", "Spotify"];

const categories = [
  { icon: Code2, label: "Development", color: "text-blue-500" },
  { icon: Palette, label: "Design", color: "text-purple-500" },
  { icon: Briefcase, label: "Business", color: "text-green-500" },
  { icon: MonitorPlay, label: "Marketing", color: "text-pink-500" },
  { icon: BrainCircuit, label: "AI & ML", color: "text-cyan-500" },
  { icon: Globe, label: "Language", color: "text-orange-500" },
  { icon: Database, label: "Data Science", color: "text-yellow-500" },
  { icon: LineChart, label: "Finance", color: "text-emerald-500" },
];

const courses = [
  {
    id: "1",
    title: "The Completed Web Development Bootcamp 2026",
    instructor: "Dr. Angela Yu",
    rating: 4.8,
    students: "1.2k",
    price: "$89.99",
    oldPrice: "$199.99",
    bestseller: true,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    category: "Development",
  },
  {
    id: "2",
    title: "Master Digital Marketing: Strategy & Analytics",
    instructor: "Seth Godin",
    rating: 4.9,
    students: "850",
    price: "$94.99",
    oldPrice: "$149.99",
    bestseller: true,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    category: "Marketing",
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass: From Zero to Hero",
    instructor: "Gary Simon",
    rating: 4.7,
    students: "2.1k",
    price: "$79.99",
    oldPrice: "$129.99",
    bestseller: false,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    category: "Design",
  },
  {
    id: "4",
    title: "Machine Learning A-Z: Hands-On Python & R",
    instructor: "Kirill Eremenko",
    rating: 4.8,
    students: "3.5k",
    price: "$109.99",
    oldPrice: "$299.99",
    bestseller: true,
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop",
    category: "Data Science",
  },
];

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const goSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    void navigate({
      to: "/courses",
      search: search.trim() ? { q: search.trim() } : {},
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-white font-sans overflow-x-hidden">
      <CustomCursor />
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="container relative z-10 px-6 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-sm mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                </span>
                <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">
                  New Season Live
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Unlock Your <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-gold-400 to-amber-600">
                  Potential
                </span>
              </h1>

              <p className="text-lg text-zinc-400 mb-8 max-w-lg leading-relaxed">
                Learn from industry experts at top companies. Master the skills
                that drive your career forward with our professional
                certification programs.
              </p>

              {/* Search Bar - Udemy Style */}
              <form onSubmit={goSearch} className="relative max-w-md mb-8 group">
                <div className="absolute inset-0 bg-linear-to-r from-gold-500 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex items-center bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-full p-2 shadow-2xl">
                  <Search className="ml-4 w-5 h-5 text-zinc-500" />
                  <Input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="What do you want to learn?"
                    className="border-none bg-transparent focus-visible:ring-0 text-zinc-900 dark:text-white placeholder:text-zinc-500 h-10 px-4"
                  />
                  <Button type="submit" className="keep-contrast rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 font-semibold">
                    Search
                  </Button>
                </div>
              </form>

              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-xs overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <p>
                  Trusted by <span className="text-white font-bold">50k+</span>{" "}
                  students
                </p>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-12">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
                      width={400}
                      height={500}
                      alt="Hero 1"
                      className="object-cover h-64 w-full group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop"
                      width={400}
                      height={500}
                      alt="Hero 2"
                      className="object-cover h-48 w-full group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
                      width={400}
                      height={500}
                      alt="Hero 3"
                      className="object-cover h-48 w-full group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img
                      src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop"
                      width={400}
                      height={500}
                      alt="Hero 4"
                      className="object-cover h-64 w-full group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED BRANDS --- */}
      <section className="py-20 border-y border-white/5 bg-black overflow-hidden relative">
        <div className="container mx-auto px-6 mb-10 text-center">
          <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">
            Trusted by market leaders
          </p>
        </div>

        <div className="relative flex overflow-x-hidden group">
          <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

          <div className="flex gap-20 py-16 animate-scroll group-hover:paused whitespace-nowrap min-w-full items-center flex-none pr-20 leading-normal">
            {[...brands, ...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-zinc-800 via-zinc-600 to-zinc-800 hover:from-gold-300 hover:via-yellow-100 hover:to-gold-500 transition-all duration-700 cursor-pointer select-none py-4"
              >
                {brand}
              </span>
            ))}
          </div>
          <div
            className="flex gap-20 py-16 animate-scroll group-hover:paused whitespace-nowrap min-w-full items-center flex-none pr-20 leading-normal"
            aria-hidden="true"
          >
            {[...brands, ...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-zinc-800 via-zinc-600 to-zinc-800 hover:from-gold-300 hover:via-yellow-100 hover:to-gold-500 transition-all duration-700 cursor-pointer select-none py-4"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Top Categories
              </h2>
              <p className="text-zinc-400">
                Explore our most popular subjects and skills.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() =>
                  void navigate({
                    to: "/courses",
                    search: { category: cat.label },
                  })
                }
                className="text-left p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-gold-500/50 hover:bg-zinc-800 transition-all cursor-pointer group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                <cat.icon
                  className={`w-10 h-10 ${cat.color} mb-4 group-hover:text-white transition-colors`}
                />
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{cat.label}</h3>
                <p className="mt-2 text-xs text-zinc-500 group-hover:text-amber-400/80 transition-colors">
                  Browse courses →
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED COURSES --- */}
      <section className="py-24 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Featured Courses
              </h2>
              <p className="text-zinc-400">
                Hand-picked by our editors for their quality.
              </p>
            </div>
            <Link
              to="/courses"
              className="hidden md:inline-flex items-center rounded-full border border-white/30 bg-transparent px-5 py-2 text-sm font-medium text-zinc-900 dark:text-white hover:bg-white hover:text-black transition-colors"
            >
              View All Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() =>
                  void navigate({
                    to: "/courses/$id",
                    params: { id: course.id },
                  })
                }
                className="group relative text-left bg-white dark:bg-[#0F0F12] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 hover:shadow-2xl hover:shadow-gold-900/10 hover:-translate-y-2 transition-all duration-300 h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full"
                  />
                  {course.bestseller && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase z-10">
                      Bestseller
                    </div>
                  )}
                  <div className="keep-contrast absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-[1]">
                    <span className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium">
                      Preview Course
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 text-zinc-900 dark:text-white group-hover:text-gold-400 transition-colors mb-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{course.instructor}</p>

                  <div className="flex items-center gap-1 mb-3">
                    <span className="font-bold text-amber-500">{course.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className="w-3 h-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs text-zinc-500 ml-1">({course.students})</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 font-semibold">
                    <div>
                      <span className="text-lg text-zinc-900 dark:text-white">{course.price}</span>
                      <span className="ml-2 text-sm text-zinc-500 line-through decoration-zinc-600">
                        {course.oldPrice}
                      </span>
                    </div>
                    <span className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-black transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 w-full md:hidden">
            <Link
              to="/courses"
              className="flex w-full items-center justify-center rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-zinc-900 dark:text-white hover:bg-white hover:text-black transition-colors"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* --- VALUE PROPOSITION / LEARNING JOURNEY --- */}
      <section className="py-28 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-gold-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-linear-to-r from-gold-500 to-amber-600 rounded-full blur-3xl opacity-20"></div>
              <div className="relative h-125 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000&auto=format&fit=crop"
                  alt="Instructor"
                  
                  className="object-cover"
                />
                <div className="keep-contrast absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-6 rounded-xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <PlayCircle className="text-gold-500 w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        Resume where you left off
                      </p>
                      <p className="text-sm text-zinc-400">
                        Lesson 4: Advanced Composition
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Learn from the <br />{" "}
                <span className="text-gold-500">World's Best</span>
              </h2>
              <p className="text-lg text-zinc-400 mb-8">
                Experience a learning journey unlike any other. Our platform
                combines aesthetic brilliance with pedagogical expertise.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      Expert-Led Courses
                    </h4>
                    <p className="text-zinc-500">
                      Learners from 160+ countries and thousands of dedicated
                      instructors.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Timer className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      Lifetime Access
                    </h4>
                    <p className="text-zinc-500">
                      Learn at your own pace, with lifetime access to your
                      courses on mobile and desktop.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      Recognized Certificates
                    </h4>
                    <p className="text-zinc-500">
                      Earn a certificate of completion for every course to
                      showcase your skills.
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild className="mt-10 rounded-full h-12 px-8 bg-gold-500 text-black hover:bg-gold-600 font-bold">
                <Link to="/signup">Start Learning Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- INSTRUCTOR CTA --- */}
      <section className="relative py-40 overflow-hidden bg-black border-t border-white/5">
        {/* Cinematic Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-gold-400/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header Content */}
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 ring-1 ring-white/5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                </span>
                <span className="text-xs font-medium text-gold-200 tracking-[0.2em] uppercase">
                  Join the Elite
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-6xl md:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9]"
              >
                Become an <br />
                <span className="font-serif italic text-transparent bg-clip-text bg-linear-to-br from-white via-gold-300 to-gold-500 pr-4 filter-[drop-shadow(0_0_15px_rgba(234,179,8,0.2))] [-webkit-text-stroke:1px_rgba(255,255,255,0.1)]">
                  Instructor
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light"
              >
                Join a global community of educators. We provide the{" "}
                <span className="text-white font-normal">
                  world-class tools
                </span>{" "}
                and platform visibility you need to monetize your expertise.
              </motion.p>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-linear-to-r from-gold-400 to-amber-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
                <Button asChild className="relative h-16 px-12 rounded-full bg-zinc-900 border border-gold-500/50 text-white font-medium text-lg overflow-hidden group-hover:text-gold-400 transition-colors">
                  <Link to="/signup">
                    <span className="relative z-10 flex items-center">
                      Start Teaching
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <Button
                variant="ghost"
                asChild
                className="h-16 px-10 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 transition-all text-lg font-light tracking-wide"
              >
                <Link to="/courses">Learn More</Link>
              </Button>
            </motion.div>

            {/* Stats - Horizontal Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-b border-white/10 bg-white/2"
            >
              {[
                { label: "Active Instructors", value: "10k+" },
                { label: "Total Students", value: "2.5M+" },
                { label: "Course Enrollments", value: "15M+" },
                { label: "Global Reach", value: "160+" },
              ].map((stat, i) => (
                <div key={i} className="py-10 px-6 text-center group">
                  <div className="text-4xl md:text-5xl font-serif text-white mb-2 group-hover:text-gold-400 transition-colors duration-500">
                    {stat.value}
                  </div>
                  <div className="text-xs tracking-[0.2em] text-zinc-500 uppercase group-hover:text-zinc-300 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 bg-black border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-white mb-4">SkillBridge</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link to="/courses" className="hover:text-gold-500">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-gold-500">
                    Get started
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-gold-500">
                    Log in
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Learn</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link to="/student/dashboard" className="hover:text-gold-500">
                    Student dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/student/quizzes" className="hover:text-gold-500">
                    Quizzes
                  </Link>
                </li>
                <li>
                  <Link to="/student/certificates" className="hover:text-gold-500">
                    Certificates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Teach</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link to="/instructor/dashboard" className="hover:text-gold-500">
                    Instructor studio
                  </Link>
                </li>
                <li>
                  <Link to="/instructor/courses" className="hover:text-gold-500">
                    My courses
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-gold-500">
                    Become an instructor
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <Link to="/admin" className="hover:text-gold-500">
                    Admin
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@skillbridge.io" className="hover:text-gold-500">
                    support@skillbridge.io
                  </a>
                </li>
                <li>
                  <span className="text-zinc-600">New York, NY 10012, US</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-sm">
            <p>&copy; 2026 SkillBridge Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span>English (US)</span>
              <span>USD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


