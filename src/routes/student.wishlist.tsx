import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Heart, ShoppingCart, Star } from "lucide-react";

export const Route = createFileRoute("/student/wishlist")({ component: Wishlist });

const items = [
  { title: "Modern System Design", instructor: "James Cole", rating: 4.9, hours: 18, price: 79, color: "from-amber-500/30 to-orange-500/10" },
  { title: "Advanced SQL Patterns", instructor: "Mei Chen", rating: 4.8, hours: 14, price: 59, color: "from-indigo-500/30 to-amber-500/10" },
  { title: "Brand Identity Studio", instructor: "Hannah Ortiz", rating: 4.7, hours: 11, price: 49, color: "from-fuchsia-500/30 to-amber-500/10" },
  { title: "Rust for Web Devs", instructor: "Liam Park", rating: 4.9, hours: 22, price: 89, color: "from-emerald-500/30 to-amber-500/10" },
];

function Wishlist() {
  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <h2 className="text-3xl font-light tracking-tight text-white font-serif">
          Your <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">Wishlist</span>
        </h2>
        <p className="text-sm text-zinc-400 mt-1">{items.length} courses saved for later</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 hover:border-amber-500/40 transition-colors"
          >
            <div className={`h-32 bg-gradient-to-br ${c.color} relative`}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.18),transparent_60%)]" />
              <button className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-950/70 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20">
                <Heart className="h-3.5 w-3.5 fill-amber-400" />
              </button>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors leading-snug">{c.title}</h4>
              <p className="text-xs text-zinc-500 mt-1">{c.instructor}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /> {c.rating}
                </span>
                <span className="text-zinc-500 inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {c.hours}h
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-white">${c.price}</span>
                <button className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors">
                  <ShoppingCart className="h-3.5 w-3.5" /> Enroll
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
