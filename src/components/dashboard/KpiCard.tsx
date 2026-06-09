import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  trend?: number;
  icon: LucideIcon;
  accent?: string;
};

export default function KpiCard({ label, value, trend, icon: Icon, accent = "bg-indigo-50 text-indigo-600" }: Props) {
  const positive = (trend ?? 0) >= 0;
  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-5">
      <div className="flex items-start justify-between">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", accent)}>
          <Icon className="h-5 w-5" />
        </div>
        {typeof trend === "number" && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1",
              positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
            )}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
