import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createReview, updateReview } from "@/lib/api/lms";
import { toast } from "sonner";

export type ApiReview = {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  helpfulCount?: number;
  student?: {
    name?: string;
    avatar?: { url?: string };
  };
};

interface ReviewsSectionProps {
  courseId: string;
  rating: number;
  totalReviews: number;
  reviews: ApiReview[];
  enrolled: boolean;
  myReview?: ApiReview | null;
  onChanged?: () => void;
}

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function distributionFromReviews(reviews: ApiReview[]) {
  const counts = [0, 0, 0, 0, 0];
  for (const r of reviews) {
    const i = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
    counts[i] += 1;
  }
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percentage: Math.round((counts[stars - 1] / total) * 100),
  }));
}

export function ReviewsSection({
  courseId,
  rating,
  totalReviews,
  reviews,
  enrolled,
  myReview,
  onChanged,
}: ReviewsSectionProps) {
  const distribution = useMemo(() => distributionFromReviews(reviews), [reviews]);
  const [stars, setStars] = useState(myReview?.rating || 5);
  const [comment, setComment] = useState(myReview?.comment || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStars(myReview?.rating || 5);
    setComment(myReview?.comment || "");
  }, [myReview?._id, myReview?.rating, myReview?.comment]);

  const submit = async () => {
    if (!comment.trim()) return toast.error("Write a short review");
    setSaving(true);
    try {
      if (myReview?._id) {
        await updateReview(courseId, myReview._id, { rating: stars, comment: comment.trim() });
        toast.success("Review updated");
      } else {
        await createReview(courseId, { rating: stars, comment: comment.trim() });
        toast.success("Review submitted");
      }
      onChanged?.();
    } catch (e: any) {
      toast.error(e?.message || "Could not save review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-serif font-bold text-white">Student Feedback</h2>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="text-6xl font-bold text-white">{rating || 0}</div>
          <div className="flex text-gold-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-current" : "text-zinc-700"}`}
              />
            ))}
          </div>
          <div className="text-zinc-500 font-medium">
            Course Rating · {totalReviews} review{totalReviews === 1 ? "" : "s"}
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-4">
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-500" style={{ width: `${item.percentage}%` }} />
              </div>
              <div className="flex items-center gap-1 min-w-12 text-sm text-zinc-400">
                <div className="flex text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < item.stars ? "fill-current" : "text-zinc-800"}`}
                    />
                  ))}
                </div>
                <span>{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {enrolled ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
          <h3 className="text-lg font-semibold text-white">
            {myReview ? "Update your review" : "Leave a review"}
          </h3>
          <p className="text-xs text-zinc-500">Only students who purchased this course can review.</p>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStars(i + 1)}
                className="p-0.5"
                aria-label={`${i + 1} stars`}
              >
                <Star
                  className={`w-6 h-6 ${i < stars ? "fill-current text-gold-500" : "text-zinc-600"}`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="What did you think of the course?"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
          />
          <Button
            type="button"
            disabled={saving}
            onClick={() => void submit()}
            className="bg-amber-500 text-zinc-950 hover:bg-amber-400"
          >
            {saving ? "Saving…" : myReview ? "Update review" : "Submit review"}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-zinc-500 border border-zinc-800/80 rounded-lg px-4 py-3">
          Purchase this course to leave a review.
        </p>
      )}

      <div className="space-y-8">
        <h3 className="text-xl font-bold text-white">Reviews ({totalReviews})</h3>

        {!reviews.length && (
          <p className="text-sm text-zinc-500">No reviews yet. Be the first after enrolling.</p>
        )}

        <div className="grid gap-6">
          {reviews.map((review) => {
            const name = review.student?.name || "Student";
            return (
              <div key={review._id} className="border-b border-zinc-800 pb-8 last:border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={review.student?.avatar?.url} />
                      <AvatarFallback className="bg-zinc-800 text-gold-500 border border-gold-500/20">
                        {initials(name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-zinc-200">{name}</div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <div className="flex text-gold-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-zinc-700"}`}
                            />
                          ))}
                        </div>
                        {review.createdAt && (
                          <span>· {new Date(review.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{review.comment}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
