import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

const LoadingSpinner = ({
  size = 24,
  className = "",
  text = "Loading...",
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-tendercuts-red" />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
