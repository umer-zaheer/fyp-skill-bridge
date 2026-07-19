import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white selection:bg-amber-500/30 selection:text-amber-700 dark:selection:text-amber-200">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 items-center justify-center">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-200/40 via-zinc-100 to-zinc-50 dark:from-amber-900/20 dark:via-zinc-900 dark:to-zinc-950" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md px-10"
        >
          <Link to="/" className="mb-8 flex items-center gap-3 w-fit group">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 backdrop-blur-sm group-hover:border-amber-500/40 transition-colors">
              <GraduationCap className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif">
              Skill Bridge.
            </h1>
          </Link>

          <h2 className="text-5xl font-light tracking-tight leading-[1.1] mb-6 text-zinc-800 dark:text-zinc-100">
            Elevate your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-amber-500 dark:from-amber-200 dark:to-amber-500 font-semibold">
              intellectual capital.
            </span>
          </h2>

          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
            Join an elite network of scholars and industry leaders. Experience
            education redefined for the modern visionary.
          </p>

          <div className="absolute -top-40 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-125 h-125 bg-indigo-500/10 dark:bg-indigo-900/10 rounded-full blur-[120px]" />
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-112.5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-8 text-center lg:text-left">
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
            </div>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
