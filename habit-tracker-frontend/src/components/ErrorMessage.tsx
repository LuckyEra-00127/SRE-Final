import { AlertCircle } from "lucide-react";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
