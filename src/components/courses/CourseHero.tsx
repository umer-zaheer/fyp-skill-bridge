

import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Users,
  Globe as GlobeIcon,
  ShieldCheck,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface CourseHeroProps {
  title: string;
  subtitle: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  updatedAt: string;
  language: string;
  instructor: {
    name: string;
    image: string;
  };
}

export function CourseHero({
  title,
  subtitle,
  rating,
  reviewsCount,
  studentsCount,
  updatedAt,
  language,
  instructor,
}: CourseHeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.2,
      });
    }
  });

  return (
    <div className="relative w-full py-24 lg:py-32 bg-black overflow-hidden border-b border-white/5">
      {/* Texture Background */}
      <div className="absolute inset-0 bg-[#0a0a0a] bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Spotlights */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 opacity-0 animate-spotlight"
        fill="#d4af37"
      />

      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/80 to-black pointer-events-none" />

      {/* Hero Glow */}
      <div className="absolute top-[-20%] right-[10%] w-150 h-150 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full backdrop-blur-md">
              <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
              <span className="text-xs font-semibold text-luxury-gold uppercase tracking-widest">
                Bestseller
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <span className="text-xs font-medium text-zinc-400">
                Architecture & Design
              </span>
            </div>
          </motion.div>

          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white mb-8 leading-none tracking-tight"
          >
            {title}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl leading-relaxed font-light mx-auto md:mx-0"
          >
            {subtitle}
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4 text-sm font-medium text-zinc-300 border-t border-white/10 pt-8"
          >
            <div className="flex items-center gap-2">
              <div className="flex text-luxury-gold">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold text-white">{rating}</span>
              <span className="text-zinc-500 underline decoration-zinc-800 underline-offset-4 cursor-pointer hover:text-white transition-colors">
                ({reviewsCount.toLocaleString()} ratings)
              </span>
            </div>

            <div className="w-px h-8 bg-white/10 hidden md:block" />

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-zinc-500" />
              <span>{studentsCount.toLocaleString()} Students</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-zinc-500" />
              <span>Last updated {updatedAt}</span>
            </div>

            <div className="flex items-center gap-3">
              <GlobeIcon className="w-5 h-5 text-zinc-500" />
              <span>{language}</span>
            </div>
          </motion.div>

          {/* Instructor & Trust */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col md:flex-row items-center gap-8"
          >
            <div className="flex items-center gap-4">
              <div className="relative p-0.5 rounded-full bg-linear-to-tr from-luxury-gold to-transparent">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black border-2 border-black">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-luxury-gold uppercase tracking-widest font-semibold mb-1">
                  Instructed By
                </span>
                <span className="text-base text-white font-serif">
                  {instructor.name}
                </span>
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 hidden md:block" />

            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-luxury-gold" />
              <span className="font-light tracking-wide">
                Verified Expert Content
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
