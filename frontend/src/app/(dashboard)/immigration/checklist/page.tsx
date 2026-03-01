"use client";

import { useState, useEffect, useCallback } from "react";
import { getChecklist, toggleChecklistItem } from "@/lib/api/immigration";
import type { ChecklistItem } from "@/types/immigration";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getChecklist();
        if (!cancelled) {
          setItems(data.sort((a, b) => a.order - b.order));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load checklist"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = useCallback(
    async (item: ChecklistItem) => {
      setTogglingId(item.id);
      try {
        const updated = await toggleChecklistItem(item.id, !item.is_completed);
        setItems((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i))
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update item"
        );
      } finally {
        setTogglingId(null);
      }
    },
    []
  );

  const completedCount = items.filter((i) => i.is_completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ClipboardCheck className="h-8 w-8 text-primary" />
          Post-Landing Checklist
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your settlement tasks after arriving in Canada.
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full" />
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Overall Progress</p>
                <p className="text-sm text-muted-foreground">
                  {completedCount} of {totalCount} completed
                </p>
              </div>
              <Progress value={progressPercent} />
            </CardContent>
          </Card>

          {categories.map((category) => {
            const catItems = items.filter((i) => i.category === category);
            const catDone = catItems.filter((i) => i.is_completed).length;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{category}</h2>
                  <Badge variant="secondary">
                    {catDone}/{catItems.length}
                  </Badge>
                </div>
                {catItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-colors ${
                      item.is_completed
                        ? "border-green-500/30 bg-green-500/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleToggle(item)}
                  >
                    <CardContent className="flex items-start gap-4 pt-6">
                      <div className="mt-0.5">
                        {togglingId === item.id ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : item.is_completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            item.is_completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
