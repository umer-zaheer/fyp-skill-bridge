import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { FilterSidebar, FilterState } from "@/components/courses/FilterSidebar";
import { CourseCard, Course } from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { SparklesCore } from "@/components/ui/sparkles";
import { Typewriter } from "@/components/ui/typewriter";
import { getCourses, searchCourses } from "@/lib/api/lms";

const coursesSearchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/courses/")({
  component: CoursesPage,
  validateSearch: coursesSearchSchema,
});

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    title: "The Python Mega Course: Build 10 Real World Applications",
    instructor: "Ardit Sulce",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    price: 19.99,
    originalPrice: 94.99,
    rating: 4.8,
    reviews: 12300,
    level: "All Levels",
    duration: "30h 15m",
    category: "Development",
    bestseller: true,
  },
  {
    id: "2",
    title: "Complete Web Design: from Figma to Webflow to Freelancing",
    instructor: "Vako Shvili",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    price: 0,
    originalPrice: 19.99,
    rating: 4.9,
    reviews: 5400,
    level: "Beginner",
    duration: "21h 30m",
    category: "Design",
  },
  {
    id: "3",
    title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
    instructor: "Kirill Eremenko",
    thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=800&auto=format&fit=crop",
    price: 12.99,
    originalPrice: 84.99,
    rating: 4.7,
    reviews: 120000,
    level: "All Levels",
    duration: "45h 0m",
    category: "Data Science",
    bestseller: true,
  },
  {
    id: "4",
    title: "100 Days of Code: The Complete Python Pro Bootcamp for 2024",
    instructor: "Dr. Angela Yu",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    price: 15.99,
    originalPrice: 79.99,
    rating: 4.8,
    reviews: 80000,
    level: "Beginner",
    duration: "60h 0m",
    category: "Development",
  },
  {
    id: "5",
    title: "Ultimate Google Ads Training 2024: Profit with Pay Per Click",
    instructor: "Isaac Rudansky",
    thumbnail: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=800&auto=format&fit=crop",
    price: 24.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 35000,
    level: "Intermediate",
    duration: "25h 10m",
    category: "Marketing",
  },
  {
    id: "6",
    title: "Adobe Photoshop CC: A Beginner to Advanced Photoshop Course",
    instructor: "Phil Ebiner",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    price: 0,
    rating: 4.5,
    reviews: 15600,
    level: "All Levels",
    duration: "18h 45m",
    category: "Design",
  },
  {
    id: "7",
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
    instructor: "Maximilian Schwarzmüller",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    price: 18.99,
    originalPrice: 89.99,
    rating: 4.8,
    reviews: 45000,
    level: "Intermediate",
    duration: "48h 30m",
    category: "Development",
  },
  {
    id: "8",
    title: "The Photography Masterclass: Your Guide to Photography",
    instructor: "Phil Ebiner",
    thumbnail: "https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=800&auto=format&fit=crop",
    price: 11.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 28000,
    level: "Beginner",
    duration: "22h 0m",
    category: "Photography",
  },
];

function mapHomeCategory(label: string): string {
  const map: Record<string, string> = {
    Development: "Development",
    Design: "Design",
    Business: "Business",
    Marketing: "Marketing",
    "AI & ML": "Data Science",
    Language: "Language",
    "Data Science": "Data Science",
    Finance: "Business",
  };
  return map[label] ?? label;
}

function CoursesPage() {
  const search = Route.useSearch();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [sortOrder, setSortOrder] = useState("Most Popular");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(search.q ?? "");
  const [filters, setFilters] = useState<FilterState>({
    categories: search.category ? [mapHomeCategory(search.category)] : [],
    levels: [],
    prices: [],
    rating: null,
  });

  useEffect(() => {
    if (search.category) {
      setFilters((prev) => ({
        ...prev,
        categories: [mapHomeCategory(search.category!)],
      }));
    }
    if (search.q) setSearchQuery(search.q);
  }, [search.category, search.q]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = searchQuery.trim()
          ? await searchCourses(searchQuery.trim())
          : await getCourses({ limit: 50 });
        if (!mounted || !res.data?.length) return;
        const mapped: Course[] = res.data.map((c: any) => ({
          id: c._id,
          title: c.title,
          instructor: c.instructor?.name || "Instructor",
          thumbnail:
            c.thumbnail?.url ||
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop",
          price: c.price,
          originalPrice: c.price,
          rating: c.rating || 0,
          reviews: c.ratingCount || c.studentsCount || 0,
          level:
            c.level === "all"
              ? "All Levels"
              : c.level
                ? c.level.charAt(0).toUpperCase() + c.level.slice(1)
                : "All Levels",
          duration: `${(c.modules || []).reduce(
            (n: number, m: any) => n + (m.lessons?.length || 0),
            0,
          )} lessons`,
          category: c.category?.name || "General",
        }));
        setCourses(mapped);
      } catch {
        /* keep mock fallback */
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [searchQuery]);

  const filteredCourses = courses.filter((course) => {
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(course.category)
    ) {
      return false;
    }
    if (filters.levels.length > 0 && !filters.levels.includes(course.level)) {
      return false;
    }
    if (filters.prices.length > 0) {
      const isFree = course.price === 0;
      const isPaid = course.price > 0;
      if (
        !(
          (filters.prices.includes("Free") && isFree) ||
          (filters.prices.includes("Paid") && isPaid)
        )
      ) {
        return false;
      }
    }
    if (filters.rating !== null && course.rating < filters.rating) {
      return false;
    }
    return true;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortOrder) {
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      case "Highest Rated":
        return b.rating - a.rating;
      case "Newest":
        return parseInt(b.id) - parseInt(a.id);
      case "Most Popular":
      default:
        return b.reviews - a.reviews;
    }
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white font-sans selection:bg-amber-500/20 dark:selection:bg-gold-500/30">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-32 pb-24 md:pb-32 border-b border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-black overflow-hidden flex flex-col justify-center min-h-[42vh]">
        <div className="absolute inset-0 w-full h-full opacity-40 dark:opacity-80">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={30}
            className="w-full h-full"
            particleColor="#d4af37"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-zinc-50 via-transparent to-transparent dark:from-zinc-950 dark:via-transparent dark:to-transparent" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">
            Explore <span className="text-gold-500">Masterclasses</span>
          </h1>
          <div className="max-w-2xl text-lg font-light leading-relaxed mx-auto">
            <p className="mb-4 text-zinc-600 dark:text-zinc-300">
              Discover world-class courses designed to elevate your skills.
            </p>
            <div className="min-h-8 flex justify-center">
              <Typewriter
                words={[
                  "From coding to design,",
                  "Business to photography —",
                  "Find the perfect course for your journey.",
                ]}
                className="text-zinc-800 dark:text-zinc-100 font-serif italic text-xl md:text-2xl"
                cursorClassName="bg-gold-500 h-6"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </aside>

          <main className="flex-1">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
              <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-zinc-500" />
                </div>
                <Input
                  placeholder="Search courses..."
                  className="pl-10 bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900/60 dark:border-zinc-800 dark:text-white dark:placeholder:text-zinc-500 focus-visible:border-gold-500/50 focus-visible:ring-gold-500/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden w-full md:w-auto border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="bg-white border-r-zinc-200 dark:bg-zinc-950 dark:border-r-zinc-800 p-6 overflow-y-auto"
                  >
                    <FilterSidebar
                      onClose={() => setIsFilterOpen(false)}
                      filters={filters}
                      setFilters={setFilters}
                    />
                  </SheetContent>
                </Sheet>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-48 justify-between border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <ArrowUpDown className="h-4 w-4 shrink-0" />
                        {sortOrder}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white border-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200"
                  >
                    {(
                      [
                        "Most Popular",
                        "Newest",
                        "Price: Low to High",
                        "Price: High to Low",
                        "Highest Rated",
                      ] as const
                    ).map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        className="focus:bg-zinc-100 focus:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-white cursor-pointer"
                        onClick={() => setSortOrder(opt)}
                      >
                        {opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                  No courses found
                </h3>
                <p className="text-zinc-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}

            {sortedCourses.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="ghost"
                  className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-transparent"
                >
                  Load More Courses
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
