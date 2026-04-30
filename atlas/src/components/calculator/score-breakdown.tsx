"use client";

import React from "react";
import { CRSBreakdown } from "@/types/immigration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatScore } from "@/lib/utils/format";

interface ScoreBreakdownProps {
  breakdown: CRSBreakdown;
}

const categoryConfig = [
  {
    key: "core_human_capital" as const,
    label: "Core / Human Capital",
    maxScore: 500,
    color: "bg-primary",
  },
  {
    key: "spouse_factors" as const,
    label: "Spouse Factors",
    maxScore: 40,
    color: "bg-primary-400",
  },
  {
    key: "skill_transferability" as const,
    label: "Skill Transferability",
    maxScore: 100,
    color: "bg-primary-300",
  },
  {
    key: "additional_points" as const,
    label: "Additional Points",
    maxScore: 600,
    color: "bg-primary-600",
  },
];

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {categoryConfig.map((category) => {
          const score = breakdown[category.key];
          const percentage =
            category.maxScore > 0
              ? Math.min((score / category.maxScore) * 100, 100)
              : 0;

          return (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-mobile-sm text-foreground">
                  {category.label}
                </span>
                <span className="text-mobile-sm font-semibold tabular-nums text-foreground">
                  {formatScore(score)}{" "}
                  <span className="text-muted-foreground font-normal">
                    / {formatScore(category.maxScore)}
                  </span>
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${category.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <span className="text-mobile-lg font-bold text-foreground">
              Total
            </span>
            <span className="text-mobile-lg font-bold tabular-nums text-primary">
              {formatScore(breakdown.total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
