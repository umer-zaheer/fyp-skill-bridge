import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md";
};

export default function ThemeToggle({ className, size = "md" }: Props) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-amber-600 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-amber-400 transition-colors",
        size === "sm" ? "p-1.5" : "p-2",
        className,
      )}
    >
      {isDark ? <Sun className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} /> : <Moon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />}
    </motion.button>
  );
}
