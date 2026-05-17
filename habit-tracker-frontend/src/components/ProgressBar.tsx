interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export default function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label ?? "Progress"}</span>
        <span className="text-slate-500">{percentage}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary-600 transition-all"
          style={{ width: `${percentage}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          role="progressbar"
        />
      </div>
    </div>
  );
}
