import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-10 text-center"
    >
      <AlertTriangle className="mb-2 h-8 w-8 text-destructive" />
      <p className="text-sm text-destructive">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 gap-2"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
