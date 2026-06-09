

import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress"; // I will need to check if progress exists, if not i will create a simple one.

interface Review {
  id: string;
  user: {
    name: string;
    image?: string;
    initials: string;
  };
  rating: number;
  date: string;
  content: string;
  helpful: number;
}

interface ReviewsSectionProps {
  rating: number;
  totalReviews: number;
  reviews: Review[];
}

export function ReviewsSection({
  rating,
  totalReviews,
  reviews,
}: ReviewsSectionProps) {
  const distribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 20 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-serif font-bold text-white">
        Student Feedback
      </h2>

      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="text-6xl font-bold text-white">{rating}</div>
          <div className="flex text-gold-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? "fill-current" : "text-zinc-700"}`}
              />
            ))}
          </div>
          <div className="text-zinc-500 font-medium">Course Rating</div>
        </div>

        <div className="flex-1 w-full space-y-3">
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-4">
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-500"
                  style={{ width: `${item.percentage}%` }}
                />
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

      {/* Reviews List */}
      <div className="space-y-8">
        <h3 className="text-xl font-bold text-white">
          Reviews ({totalReviews})
        </h3>

        <div className="grid gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-zinc-800 pb-8 last:border-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={review.user.image} />
                    <AvatarFallback className="bg-zinc-800 text-gold-500 border border-gold-500/20">
                      {review.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-zinc-200">
                      {review.user.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <div className="flex text-gold-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-zinc-700"}`}
                          />
                        ))}
                      </div>
                      <span>• {review.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {review.content}
              </p>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors group">
                  <ThumbsUp className="w-3.5 h-3.5 group-hover:text-gold-500 transition-colors" />
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Load More Reviews
          </Button>
        </div>
      </div>
    </div>
  );
}
