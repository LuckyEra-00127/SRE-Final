export default function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-sm font-medium text-slate-600">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary-600" />
      <span>{label}</span>
    </div>
  );
}
