"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { ProgressTracker } from "@/components/checklist/progress-tracker";
import { TaskItem } from "@/components/checklist/task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChecklistItem } from "@/types/immigration";
import { getChecklist, updateChecklistItem } from "@/lib/api/immigration";
import { Loader2, ClipboardCheck } from "lucide-react";

type FilterMode = "all" | "pending" | "completed";

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  useEffect(() => {
    async function loadChecklist() {
      try {
        const response = await getChecklist();
        setItems(response.data.sort((a, b) => a.order - b.order));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load checklist"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadChecklist();
  }, []);

  const handleToggle = useCallback(
    async (id: string, completed: boolean) => {
      setUpdatingIds((prev) => new Set(prev).add(id));

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_completed: completed } : item
        )
      );

      try {
        await updateChecklistItem(id, completed);
      } catch {
        // Revert on failure
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, is_completed: !completed } : item
          )
        );
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    []
  );

  const completedCount = items.filter((item) => item.is_completed).length;

  const filteredItems =
    filterMode === "all"
      ? items
      : filterMode === "completed"
      ? items.filter((item) => item.is_completed)
      : items.filter((item) => !item.is_completed);

  // Group items by category
  const groupedItems = filteredItems.reduce<Record<string, ChecklistItem[]>>(
    (groups, item) => {
      const category = item.category || "General";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    },
    {}
  );

  const filterOptions: { value: FilterMode; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Done" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack title="Checklist" />

      <main className="flex-1 px-4 py-5">
        <div className="mx-auto max-w-lg space-y-5">
          {/* Header */}
          <div>
            <h1 className="text-mobile-2xl font-bold text-foreground">
              Post-Landing Checklist
            </h1>
            <p className="mt-1 text-mobile-sm text-muted-foreground">
              Track your essential tasks after arriving in Canada
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-3 text-mobile-sm text-muted-foreground">
                Loading your checklist...
              </p>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-mobile-sm text-destructive">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress */}
              <ProgressTracker
                completed={completedCount}
                total={items.length}
              />

              {/* Filters */}
              <div className="flex gap-2">
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      filterMode === option.value ? "default" : "outline"
                    }
                    size="sm"
                    className="flex-1"
                    onClick={() => setFilterMode(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Tasks grouped by category */}
              {Object.keys(groupedItems).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-3 text-mobile-base font-medium text-foreground">
                      {filterMode === "pending"
                        ? "All tasks completed!"
                        : "No tasks found"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6 pb-20">
                  {Object.entries(groupedItems).map(
                    ([category, categoryItems]) => (
                      <div key={category}>
                        <h2 className="mb-3 text-mobile-sm font-semibold uppercase tracking-wider text-muted-foreground">
                          {category}
                        </h2>
                        <div className="space-y-3">
                          {categoryItems.map((item) => (
                            <TaskItem
                              key={item.id}
                              item={item}
                              onToggle={handleToggle}
                              disabled={updatingIds.has(item.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer className="pb-20" />
      <MobileNav />
    </div>
  );
}
