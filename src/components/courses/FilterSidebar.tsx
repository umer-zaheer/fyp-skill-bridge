import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "Development",
  "Design",
  "Data Science",
  "Marketing",
  "Business",
  "Language",
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

function FilterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
      {children}
    </h3>
  );
}

function CheckBox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer w-4 h-4 appearance-none border border-zinc-300 rounded-sm bg-white checked:border-gold-500 dark:border-zinc-700 dark:bg-zinc-900 dark:checked:border-gold-500 transition-colors"
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
  );
}

function optionClass(active: boolean) {
  return cn(
    "text-sm transition-colors",
    active
      ? "text-zinc-900 dark:text-white font-medium"
      : "text-zinc-500 group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-white",
  );
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
    <div className={cn("space-y-8", className)}>
      {onClose && (
        <div className="flex items-center justify-between lg:hidden mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-600 dark:text-zinc-300">
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <FilterHeading>Categories</FilterHeading>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <CheckBox
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <span className={optionClass(filters.categories.includes(category))}>
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-4">
        <FilterHeading>Level</FilterHeading>
        <div className="space-y-3">
          {levels.map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer group">
              <CheckBox
                checked={filters.levels.includes(level)}
                onChange={() => handleLevelChange(level)}
              />
              <span className={optionClass(filters.levels.includes(level))}>{level}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-4">
        <FilterHeading>Price</FilterHeading>
        <div className="space-y-3">
          {prices.map((price) => (
            <label key={price} className="flex items-center gap-3 cursor-pointer group">
              <CheckBox
                checked={filters.prices.includes(price)}
                onChange={() => handlePriceChange(price)}
              />
              <span className={optionClass(filters.prices.includes(price))}>{price}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-4">
        <FilterHeading>Ratings</FilterHeading>
        <div className="space-y-3">
          {ratings.map((rating) => {
            const active = filters.rating === rating.value;
            return (
              <label
                key={rating.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                  <input
                    type="radio"
                    name="rating"
                    checked={active}
                    onChange={() => setFilters({ ...filters, rating: rating.value })}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-full h-full rounded-full border transition-colors bg-white dark:bg-zinc-900",
                      active ? "border-gold-500" : "border-zinc-300 dark:border-zinc-700",
                    )}
                  />
                  {active && <div className="absolute w-2 h-2 rounded-full bg-gold-500" />}
                </div>
                <div className={cn("flex items-center gap-1 text-sm", optionClass(active))}>
                  <span className="text-amber-500 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          "w-3.5 h-3.5",
                          i < Math.floor(rating.value)
                            ? "fill-current"
                            : "fill-zinc-300 text-zinc-300 dark:fill-zinc-700 dark:text-zinc-700",
                        )}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </span>
                  <span>{rating.label}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
