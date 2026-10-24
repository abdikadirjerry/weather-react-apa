import type { LucideIcon } from "lucide-react";

interface WeatherCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function WeatherCard({ label, value, icon: Icon }: WeatherCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
