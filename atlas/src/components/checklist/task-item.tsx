"use client";

import React from "react";
import { ChecklistItem } from "@/types/immigration";
import { formatDate } from "@/lib/utils/format";
import { ExternalLink, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface TaskItemProps {
  item: ChecklistItem;
  onToggle: (id: string, completed: boolean) => void;
  disabled?: boolean;
}

export function TaskItem({ item, onToggle, disabled = false }: TaskItemProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        item.is_completed
          ? "border-success/30 bg-success/5"
          : "border-border bg-card",
        disabled && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id, !item.is_completed)}
          disabled={disabled}
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all active:scale-90",
            item.is_completed
              ? "border-success bg-success"
              : "border-muted-foreground hover:border-primary"
          )}
          aria-label={
            item.is_completed
              ? `Mark "${item.title}" as incomplete`
              : `Mark "${item.title}" as complete`
          }
        >
          {item.is_completed && <Check className="h-4 w-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-mobile-base font-medium",
              item.is_completed
                ? "text-muted-foreground line-through"
                : "text-foreground"
            )}
          >
            {item.title}
          </p>
          <p className="mt-1 text-mobile-xs text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            {item.due_date && (
              <span className="inline-flex items-center gap-1 text-mobile-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(item.due_date)}
              </span>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-mobile-xs font-medium text-primary hover:underline"
              >
                Resource
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
