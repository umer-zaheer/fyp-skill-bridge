

import { Star, PlayCircle, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Course } from "./CourseCard";

interface InstructorSectionProps {
  instructor: {
    name: string;
    bio: string;
    image: string;
    rating: number;
    reviews: number;
    students: number;
    courses: number;
  };
  featuredCourses: Course[];
}

export function InstructorSection({
  instructor,
  featuredCourses,
}: InstructorSectionProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif font-light text-white tracking-tight">
        Your Instructor
      </h2>

      <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-xl shadow-[0_0_50px_-20px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
          {/* Avatar */}
          <div className="shrink-0 text-center md:text-left">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-luxury-gold/20 mx-auto md:mx-0 p-1">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2 md:hidden">
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                <Star className="w-4 h-4 text-luxury-gold fill-current" />
                <span className="text-white font-bold">
                  {instructor.rating}
                </span>{" "}
                Instructor Rating
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gold-400 mb-1">
                {instructor.name}
              </h3>
              <p className="text-zinc-400 text-sm uppercase tracking-wide">
                Senior Developer & Educator
              </p>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-zinc-400 border-y border-zinc-800 py-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-luxury-gold fill-current" />
                <span className="text-white font-bold">
                  {instructor.rating}
                </span>{" "}
                Rating
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-luxury-gold" />
                <span className="text-white font-bold">
                  {instructor.reviews.toLocaleString()}
                </span>{" "}
                Reviews
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-luxury-gold" />
                <span className="text-white font-bold">
                  {instructor.students.toLocaleString()}
                </span>{" "}
                Students
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-luxury-gold" />
                <span className="text-white font-bold">
                  {instructor.courses}
                </span>{" "}
                Courses
              </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
              <p>{instructor.bio}</p>
            </div>
          </div>
        </div>

        {/* Other Courses */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-medium text-white tracking-wide">
              More from {instructor.name}
            </h4>
            <a
              href="#"
              className="text-xs text-luxury-gold hover:text-[#f3c848] transition-colors uppercase tracking-widest font-semibold"
            >
              View all courses
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredCourses.slice(0, 2).map((course) => (
              <Link
                to={`/courses/${course.id}`}
                key={course.id}
                data-cursor="card"
                className="group flex gap-3 p-3 rounded-lg bg-black/40 hover:bg-zinc-900 border border-white/5 hover:border-luxury-gold/30 transition-all duration-300"
              >
                <div className="relative w-24 aspect-video shrink-0 rounded overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h5 className="text-sm font-serif font-medium text-zinc-300 group-hover:text-luxury-gold line-clamp-2 transition-colors">
                    {course.title}
                  </h5>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-white">
                      ${course.price}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-luxury-gold">
                      {course.rating} <Star className="w-3 h-3 fill-current" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
