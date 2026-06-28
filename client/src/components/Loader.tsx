import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export default function Loader({ size = "md", label, className = "" }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} role="status">
      <Loader2
        className={`animate-spin text-blue-600 ${sizeMap[size]}`}
        aria-hidden
      />
      {label && (
        <p className="text-sm text-slate-600" aria-live="polite">
          {label}
        </p>
      )}
    </div>
  );
}
