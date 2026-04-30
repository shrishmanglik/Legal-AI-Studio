"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <svg
            className="h-8 w-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          An unexpected error occurred. This may be a temporary issue. Please try
          again or contact support if the problem persists.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          Try Again
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="outline"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
