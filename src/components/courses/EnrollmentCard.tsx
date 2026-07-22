import { defaultCoursePreview } from "@/lib/defaultImages";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Zap, Tag, Check, X, MonitorPlay, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  addWishlist,
  checkoutCourse,
  validateCoupon,
} from "@/lib/api/lms";
import { ApiError } from "@/lib/api/client";

interface EnrollmentCardProps {
  courseId: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  features: string[];
  thumbnail?: string;
  enrolled?: boolean;
}

export function EnrollmentCard({
  courseId,
  price,
  originalPrice,
  discount = 0,
  features,
  thumbnail,
  enrolled = false,
}: EnrollmentCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [currentPrice, setCurrentPrice] = useState(price);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const displayOriginal = originalPrice ?? price;

  const handleApplyCoupon = async () => {
    try {
      const res = await validateCoupon(couponCode, courseId);
      setCurrentPrice(res.data.finalPrice);
      setAppliedCode(res.data.code);
      setDiscountApplied(true);
      setCouponError("");
      toast.success(`${res.data.percentOff}% off applied`);
    } catch (e) {
      setCouponError(e instanceof ApiError ? e.message : "Invalid coupon");
      setDiscountApplied(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCurrentPrice(price);
    setDiscountApplied(false);
    setCouponCode("");
    setAppliedCode("");
  };

  const handleBuy = async () => {
    if (!isAuthenticated) {
      void navigate({ to: "/login" });
      return;
    }
    setLoading(true);
    try {
      const res = await checkoutCourse(courseId, appliedCode || undefined);
      if (res.free) {
        toast.success("Enrolled successfully");
        void navigate({ to: "/student/courses" });
        return;
      }
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      toast.error("Checkout unavailable");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      void navigate({ to: "/login" });
      return;
    }
    try {
      await addWishlist(courseId);
      toast.success("Saved to wishlist", {
        action: {
          label: "Open",
          onClick: () => {
            window.location.href = "/student/wishlist";
          },
        },
      });
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Could not save");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-28 group/card"
    >
      <div className="absolute -inset-0.5 bg-linear-to-br from-luxury-gold/20 to-transparent rounded-xl blur opacity-20 pointer-events-none transition duration-1000 group-hover/card:opacity-40" />
      <Card className="relative bg-luxury-black border-luxury-gold/20 shadow-[0px_0px_50px_-12px_rgba(212,175,55,0.1)] rounded-xl overflow-hidden">
        <div className="relative aspect-video bg-zinc-900 group cursor-pointer overflow-hidden border-b border-luxury-gold/10">
          {isPlaying ? (
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
              title="Course Preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          ) : (
            <div onClick={() => setIsPlaying(true)} className="relative w-full h-full">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: `url('${thumbnail || defaultCoursePreview}')`,
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full keep-contrast bg-black/40 backdrop-blur-sm border border-luxury-gold/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all duration-700 z-20">
                  <PlayCircle className="w-6 h-6 text-white ml-0.5 fill-white/10 group-hover:text-black group-hover:fill-black/20 transition-colors duration-500" />
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center z-10 w-full flex justify-center">
                <Badge
                  variant="outline"
                  className="bg-black/60 border-luxury-gold/40 backdrop-blur-md text-luxury-gold tracking-[0.2em] text-[10px] font-medium px-4 py-1"
                >
                  PREVIEW
                </Badge>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-8 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant="outline"
                className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
              >
                <Zap size={14} className="fill-current mr-1" />
                SkillBridge
              </Badge>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-serif text-zinc-900 dark:text-white tracking-tight">
                ${currentPrice.toFixed(2)}
              </span>
              {displayOriginal > currentPrice && (
                <span className="text-lg text-zinc-600 line-through decoration-zinc-700 decoration-1">
                  ${displayOriginal.toFixed(2)}
                </span>
              )}
              {(discountApplied || discount > 0) && (
                <Badge
                  variant="outline"
                  className="bg-luxury-gold/5 text-luxury-gold border-luxury-gold/30 text-[10px] tracking-wider font-normal px-2"
                >
                  {discountApplied
                    ? Math.round(((displayOriginal - currentPrice) / displayOriginal) * 100)
                    : discount}
                  % OFF
                </Badge>
              )}
            </div>
            {discountApplied && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-emerald-400 text-xs mt-2 flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Coupon {appliedCode} applied!
              </motion.div>
            )}
          </div>

          <div className="space-y-3 mt-6">
            {enrolled ? (
              <Button
                asChild
                className="w-full text-sm tracking-widest font-semibold uppercase bg-luxury-gold text-black"
                size="lg"
              >
                <Link to="/student/courses/$id" params={{ id: courseId }}>
                  Go to course
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                disabled={loading}
                onClick={() => void handleBuy()}
                className="relative w-full text-sm tracking-widest font-semibold uppercase bg-luxury-gold hover:bg-[#c5a028] text-black"
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentPrice === 0 ? "Enroll free" : "Buy Now"}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleWishlist()}
              className="w-full text-sm tracking-widest font-semibold uppercase border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
              size="lg"
            >
              Add to Wishlist
            </Button>
          </div>

          <div className="pt-2">
            <Separator className="my-4 bg-zinc-800" />
            {!discountApplied ? (
              <div className="flex gap-2 w-full">
                <div className="relative w-full">
                  <Input
                    placeholder="Enter Coupon Code"
                    className="bg-black/20 border-zinc-800 focus-visible:ring-luxury-gold text-zinc-200 pl-9"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                    }}
                  />
                  <Tag className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
                <Button
                  className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                  onClick={() => void handleApplyCoupon()}
                >
                  Apply
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-emerald-900/20 border border-emerald-500/20 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-400">
                    Code: <span className="font-bold">{appliedCode}</span>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-zinc-500 hover:text-white h-auto p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
          </div>

          <div className="space-y-6 pt-2">
            <Separator className="bg-zinc-800" />
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Key Features</h4>
            <ul className="space-y-4">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 group">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
                    <MonitorPlay className="w-3 h-3 text-zinc-500" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
