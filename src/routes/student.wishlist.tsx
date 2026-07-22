import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Heart, Loader2, ShoppingCart, Star, Trash2 } from "lucide-react";
import { listWishlist, removeWishlist } from "@/lib/api/lms";
import { toast } from "sonner";

export const Route = createFileRoute("/student/wishlist")({ component: Wishlist });

function Wishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await listWishlist();
      setItems(res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (courseId: string) => {
    try {
      await removeWishlist(courseId);
      setItems((prev) => prev.filter((i) => i.course?._id !== courseId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Could not remove");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <h2 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-white font-serif">
          Your{" "}
          <span className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-200 dark:to-amber-500 bg-clip-text text-transparent font-semibold">
            Wishlist
          </span>
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {items.length} courses saved for later
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nothing saved yet. Browse the{" "}
          <Link to="/courses" className="text-amber-400 underline">
            catalog
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((row, i) => {
            const c = row.course || {};
            return (
              <motion.div
                key={row._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60"
              >
                <Link to="/courses/$id" params={{ id: c._id }} className="block">
                  <div className="relative h-32 overflow-hidden bg-zinc-900">
                    <img
                      src={
                        c.thumbnail?.url ||
                        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800"
                      }
                      alt={c.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-950/70 text-amber-400 border border-amber-500/30">
                      <Heart className="h-3.5 w-3.5 fill-amber-400" />
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white leading-snug">
                      {c.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">{c.instructor?.name}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-current" /> {c.rating?.toFixed?.(1) || "—"}
                      </span>
                      <span className="text-zinc-500 inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> ${c.price}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4 flex gap-2">
                  <Link
                    to="/courses/$id"
                    params={{ id: c._id }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 py-2 text-xs font-medium"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Enroll
                  </Link>
                  <button
                    type="button"
                    onClick={() => void remove(c._id)}
                    className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
