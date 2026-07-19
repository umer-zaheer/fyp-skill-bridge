

import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Star, Clock, BarChart } from "lucide-react";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  level: string;
  duration: string;
  category: string;
  bestseller?: boolean;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to="/courses/$id" params={{ id: course.id }}>
      <Card className="group h-full pt-0 pb-3 overflow-hidden gap-3 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50 hover:border-gold-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.15)] flex flex-col">
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {course.bestseller && (
            <Badge className="absolute top-2 left-2 bg-luxury-gold text-black hover:bg-gold-600 border-none font-semibold">
              Bestseller
            </Badge>
          )}
          <div className="keep-contrast absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium px-4 py-2 border border-white/30 rounded-full backdrop-blur-sm">
              View Course
            </span>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 px-2 space-y-1">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-gold-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{course.instructor}</p>

          <div className="flex items-center gap-1">
            <span className="font-bold text-amber-600 dark:text-amber-500 flex items-center gap-1">
              {course.rating} <Star className="w-3.5 h-3.5 fill-current" />
            </span>
            <span className="text-xs text-zinc-500">
              ({course.reviews.toLocaleString()})
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <BarChart className="w-3.5 h-3.5" />
              {course.level}
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="px-3 border-t pt-0 border-zinc-200 dark:border-zinc-800/50 flex items-center [.border-t]:pt-0 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-sm text-zinc-500 line-through">
                ${course.originalPrice}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
