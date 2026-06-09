

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

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
    <div className="flex min-h-screen w-full bg-zinc-950 text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* LEFT SIDE - The "Art" */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-900 items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-900/20 via-zinc-900 to-zinc-950" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md px-10"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 backdrop-blur-sm">
              <GraduationCap className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white font-serif">
              Skill Bridge.
            </h1>
          </div>

          <h2 className="text-5xl font-light tracking-tight leading-[1.1] mb-6 text-zinc-100">
            Elevate your <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-amber-500 font-semibold">
              intellectual capital.
            </span>
          </h2>

          <p className="text-lg text-zinc-400 font-light leading-relaxed">
            Join an elite network of scholars and industry leaders. Experience
            education redefined for the modern visionary.
          </p>

          {/* Abstract Luxury Decor */}
          <div className="absolute -top-40 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-125 h-125 bg-indigo-900/10 rounded-full blur-[120px]" />
        </motion.div>
      </div>

      {/* RIGHT SIDE - The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-112.5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-8 text-center lg:text-left">
              <h3 className="text-2xl font-semibold tracking-tight text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-zinc-400">{subtitle}</p>
            </div>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
