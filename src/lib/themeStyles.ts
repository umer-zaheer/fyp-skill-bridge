import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Shared surface classes for dashboard cards / panels (light + dark). */
export const surfaceCard =
  "relative rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none backdrop-blur-sm overflow-hidden hover:border-amber-500/40 dark:hover:border-amber-500/30 transition-colors duration-300";

export const surfacePanel =
  "rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60";

export const surfaceMuted =
  "rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/60";

export const surfaceInput =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-amber-500/40";

export const textPrimary = "text-zinc-900 dark:text-white";
export const textSecondary = "text-zinc-600 dark:text-zinc-300";
export const textMuted = "text-zinc-500 dark:text-zinc-400";
export const textHeading =
  "text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-white";

export const borderSubtle = "border-zinc-200 dark:border-zinc-800";
export const divideSubtle = "divide-zinc-200 dark:divide-zinc-800/60";

export const hoverRow = "hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors";

/** Solid CTA that stays high-contrast in both themes */
export const solidCta =
  "keep-contrast bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200";

type ChartTheme = {
  tooltip: CSSProperties;
  grid: string;
  axis: string;
  cursor: string;
};

export function getChartTheme(isDark: boolean): ChartTheme {
  if (isDark) {
    return {
      tooltip: {
        background: "#18181b",
        border: "1px solid #3f3f46",
        borderRadius: 8,
        color: "#fafafa",
        fontSize: 12,
      },
      grid: "#27272a",
      axis: "#71717a",
      cursor: "rgba(255,255,255,0.06)",
    };
  }
  return {
    tooltip: {
      background: "#ffffff",
      border: "1px solid #e4e4e7",
      borderRadius: 8,
      color: "#18181b",
      fontSize: 12,
      boxShadow: "0 8px 24px rgba(24,24,27,0.08)",
    },
    grid: "#e4e4e7",
    axis: "#71717a",
    cursor: "rgba(24,24,27,0.04)",
  };
}

export function cxSurface(...parts: Array<string | false | undefined>) {
  return cn(...parts);
}
