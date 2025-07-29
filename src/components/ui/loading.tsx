import { memo } from "react";

interface LoadingProps {
  className?: string;
}

const Loading = memo(function Loading({ className = "" }: LoadingProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
});

export default Loading;
