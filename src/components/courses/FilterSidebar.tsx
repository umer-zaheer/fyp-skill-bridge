

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

// Mock Data for Filters
const categories = [
  "Web Development",
  "Data Science",
  "Design",
  "Marketing",
  "Business",
  "Photography",
  "Music",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Expert"];

const prices = ["Free", "Paid"];

const ratings = [
  { label: "4.5 & up", value: 4.5 },
  { label: "4.0 & up", value: 4.0 },
  { label: "3.5 & up", value: 3.5 },
];

export interface FilterState {
  categories: string[];
  levels: string[];
  prices: string[];
  rating: number | null;
}

interface FilterSidebarProps {
  className?: string;
  onClose?: () => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export function FilterSidebar({
  className,
  onClose,
  filters,
  setFilters,
}: FilterSidebarProps) {
  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const handleLevelChange = (level: string) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level];
    setFilters({ ...filters, levels: newLevels });
  };

  const handlePriceChange = (price: string) => {
    const newPrices = filters.prices.includes(price)
      ? filters.prices.filter((p) => p !== price)
      : [...filters.prices, price];
    setFilters({ ...filters, prices: newPrices });
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header for Mobile only */}
      {onClose && (
        <div className="flex items-center justify-between lg:hidden mb-6">
          <h2 className="text-xl font-bold text-white">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-200 uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="peer w-4 h-4 appearance-none border border-zinc-700 rounded-sm bg-zinc-900 checked:border-gold-500 transition-colors"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-gold-500 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span
                className={`text-sm transition-colors ${filters.categories.includes(category) ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
              >
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      {/* Level */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-200 uppercase tracking-wider">
          Level
        </h3>
        <div className="space-y-3">
          {levels.map((level) => (
            <label
              key={level}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.levels.includes(level)}
                  onChange={() => handleLevelChange(level)}
                  className="peer w-4 h-4 appearance-none border border-zinc-700 rounded-sm bg-zinc-900 checked:border-gold-500 transition-colors"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-gold-500 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span
                className={`text-sm transition-colors ${filters.levels.includes(level) ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
              >
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      {/* Price */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-200 uppercase tracking-wider">
          Price
        </h3>
        <div className="space-y-3">
          {prices.map((price) => (
            <label
              key={price}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={filters.prices.includes(price)}
                  onChange={() => handlePriceChange(price)}
                  className="peer w-4 h-4 appearance-none border border-zinc-700 rounded-sm bg-zinc-900 checked:border-gold-500 transition-colors"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 text-gold-500 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span
                className={`text-sm transition-colors ${filters.prices.includes(price) ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
              >
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      {/* Rating */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-200 uppercase tracking-wider">
          Ratings
        </h3>
        <div className="space-y-3">
          {ratings.map((rating) => (
            <label
              key={rating.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating.value}
                  onChange={() =>
                    setFilters({ ...filters, rating: rating.value })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-full h-full rounded-full border transition-colors bg-zinc-900 ${
                    filters.rating === rating.value
                      ? "border-gold-500"
                      : "border-zinc-700"
                  }`}
                />
                {filters.rating === rating.value && (
                  <div className="absolute w-2 h-2 rounded-full bg-gold-500" />
                )}
              </div>
              <div
                className={`flex items-center gap-1 transition-colors text-sm ${filters.rating === rating.value ? "text-white" : "text-zinc-400 group-hover:text-white"}`}
              >
                <span className="text-amber-500 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(rating.value) ? "fill-current" : "fill-zinc-700 text-zinc-700"}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </span>
                <span>{rating.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
