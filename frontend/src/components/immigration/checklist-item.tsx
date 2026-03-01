"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChecklistItemProps {
  id: string;
  title: string;
  description: string;
  category: string;
  isCompleted: boolean;
  onToggle?: (id: string) => void;
}

export function ChecklistItem({
  id,
  title,
  description,
  category,
  isCompleted,
  onToggle,
}: ChecklistItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 transition-colors",
        isCompleted
          ? "border-green-500/30 bg-green-500/5"
          : "border-border bg-card"
      )}
    >
      <button
        onClick={() => onToggle?.(id)}
        className="mt-0.5 flex-shrink-0"
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {category}
        </span>
      </div>
    </div>
  );
}
