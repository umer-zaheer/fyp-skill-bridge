import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Heart, ShoppingCart, Star } from "lucide-react";
import { courseImages } from "@/lib/defaultImages";

export const Route = createFileRoute("/student/wishlist")({ component: Wishlist });

const items = [
  { id: "1", title: "Modern System Design", instructor: "James Cole", rating: 4.9, hours: 18, price: 79, image: courseImages.systemDesign },
  { id: "2", title: "Advanced SQL Patterns", instructor: "Mei Chen", rating: 4.8, hours: 14, price: 59, image: courseImages.sql },
  { id: "3", title: "Brand Identity Studio", instructor: "Hannah Ortiz", rating: 4.7, hours: 11, price: 49, image: courseImages.design },
  { id: "4", title: "Rust for Web Devs", instructor: "Liam Park", rating: 4.9, hours: 22, price: 89, image: courseImages.webDev },
];

function Wishlist() {
  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <h2 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-white font-serif">
          Your{" "}
          <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-200 dark:to-amber-500 bg-clip-text text-transparent font-semibold">
            Wishlist
          </span>
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{items.length} courses saved for later</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none hover:border-amber-500/40 transition-colors"
          >
            <Link to="/courses/$id" params={{ id: c.id }} className="block">
              <div className="relative h-32 overflow-hidden bg-zinc-900">
                <img
                  src={c.image}
                  alt={c.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
                <span className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-950/70 text-amber-400 border border-amber-500/30">
                  <Heart className="h-3.5 w-3.5 fill-amber-400" />
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
                  {c.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-1">{c.instructor}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" /> {c.rating}
                  </span>
                  <span className="text-zinc-500 inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {c.hours}h
                  </span>
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4 flex gap-2">
              <Link
                to="/courses/$id"
                params={{ id: c.id }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 py-2 text-xs font-medium hover:bg-amber-500/25 transition-colors"
              >
                <ShoppingCart className="h-3.5 w-3.5" /> Enroll
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
