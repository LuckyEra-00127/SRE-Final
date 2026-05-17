import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "blue" | "green" | "red" | "gray";
}

const accentClasses = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  red: "bg-red-50 text-red-700",
  gray: "bg-slate-100 text-slate-700"
};

export default function StatCard({ label, value, icon: Icon, accent = "blue" }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${accentClasses[accent]}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
