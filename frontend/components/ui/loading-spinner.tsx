import { Icons } from "@/components/icons";

interface LoadingSpinnerProps {
  className?: string;
  showText?: boolean;
  text?: string;
}

export default function LoadingSpinner({
  className = "",
  showText = true,
  text = "Loading",
}: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <Icons.spinner
        className={`h-8 w-8 animate-spin text-primary ${className}`}
      />
      {showText && (
        <span className="mt-2 text-sm font-medium text-gray-600">{text}</span>
      )}
    </div>
  );
}
