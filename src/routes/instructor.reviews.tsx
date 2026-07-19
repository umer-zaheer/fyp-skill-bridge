import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Filter, Send, X } from "lucide-react";
import { instructorReviews } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/instructor/reviews")({
  component: InstructorReviewsPage,
});

type FilterKey = "All" | "Unanswered" | "Replied" | "Low";

function InstructorReviewsPage() {
  const [filter, setFilter] = useState<FilterKey>("All");
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [reviews, setReviews] = useState(instructorReviews);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (filter === "Unanswered") return !r.replied;
      if (filter === "Replied") return r.replied;
      if (filter === "Low") return r.rating <= 3;
      return true;
    });
  }, [reviews, filter]);

  const avg =
    reviews.reduce((s, r) => s + r.rating, 0) / Math.max(1, reviews.length);
  const unanswered = reviews.filter((r) => !r.replied).length;
  const low = reviews.filter((r) => r.rating <= 3).length;

  const submitReply = () => {
    if (!replyId) return;
    setReviews((prev) => prev.map((r) => (r.id === replyId ? { ...r, replied: true } : r)));
    setReplyId(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6 text-zinc-200">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8"
      >
        <div className="absolute -top-16 -right-8 h-48 w-48 bg-amber-500/10 rounded-full blur-[80px]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-500/80 mb-2">Feedback</p>
          <h2 className="text-3xl font-light tracking-tight text-white font-serif">
            Student{" "}
            <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent font-semibold">
              reviews
            </span>
          </h2>
          <p className="mt-2 text-sm text-zinc-400">Respond to reviews and protect your instructor reputation.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Average rating", value: avg.toFixed(1) },
          { label: "Total reviews", value: reviews.length },
          { label: "Unanswered", value: unanswered },
          { label: "Low ratings", value: low },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-4"
          >
            <p className="text-xs uppercase tracking-wider text-zinc-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white inline-flex items-center gap-1">
              {s.label === "Average rating" && <Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-zinc-500" />
        {(["All", "Unanswered", "Replied", "Low"] as FilterKey[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
              filter === f
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "text-zinc-500 border-zinc-800 hover:text-white",
            )}
          >
            {f === "Low" ? "≤ 3 stars" : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none p-5 hover:border-amber-500/20 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={cn("h-3.5 w-3.5", idx < r.rating ? "fill-amber-400" : "text-zinc-700")}
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed">{r.body}</p>
                <p className="text-xs text-zinc-500 mt-2">
                  {r.student} · {r.course} · {r.date}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {r.replied ? (
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Replied
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setReplyId(r.id);
                      setReplyText("");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Reply
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-zinc-500 text-sm">No reviews in this filter.</p>
        )}
      </div>

      <AnimatePresence>
        {replyId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setReplyId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white font-serif">Reply to review</h3>
                <button onClick={() => setReplyId(null)} className="text-zinc-500 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Write a thoughtful reply…"
                className="w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/40 resize-none"
              />
              <button
                onClick={submitReply}
                disabled={!replyText.trim()}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 py-2.5 text-sm font-semibold text-zinc-950 transition-colors"
              >
                <Send className="h-4 w-4" />
                Send reply
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
