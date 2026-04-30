"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ProgressTrackerProps {
  completed: number;
  total: number;
}

export function ProgressTracker({ completed, total }: ProgressTrackerProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <p className="text-mobile-2xl font-bold text-foreground">
                {percentage}%
              </p>
              <p className="text-mobile-sm text-muted-foreground">
                {completed} of {total} tasks
              </p>
            </div>
            <Progress value={percentage} className="mt-2" />
          </div>
        </div>

        {percentage === 100 && (
          <div className="mt-4 rounded-lg bg-success/10 p-3 text-center">
            <p className="text-mobile-sm font-medium text-success">
              All tasks completed! You are ready for the next step.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
