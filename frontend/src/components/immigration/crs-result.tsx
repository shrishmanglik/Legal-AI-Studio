"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CRSResult } from "@/types/immigration";

interface CRSResultDisplayProps {
  result: CRSResult;
}

const BREAKDOWN_LABELS: Record<string, { label: string; max: number }> = {
  core_human_capital: { label: "Core / Human Capital", max: 500 },
  spouse_factors: { label: "Spouse Factors", max: 40 },
  skill_transferability: { label: "Skill Transferability", max: 100 },
  additional_points: { label: "Additional Points", max: 600 },
};

export function CRSResultDisplay({ result }: CRSResultDisplayProps) {
  const scorePercentage = (result.total_score / result.max_score) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your CRS Score</CardTitle>
        <CardDescription>
          Comprehensive Ranking System score breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total score */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeDasharray={`${(scorePercentage / 100) * 339.292} 339.292`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold">{result.total_score}</span>
              <span className="text-xs text-muted-foreground">
                / {result.max_score}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="space-y-4">
          <h3 className="font-medium">Score Breakdown</h3>
          {Object.entries(result.breakdown).map(([key, value]) => {
            const config = BREAKDOWN_LABELS[key];
            if (!config) return null;
            const pct = config.max > 0 ? (value / config.max) * 100 : 0;
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{config.label}</span>
                  <span className="font-medium">
                    {value} / {config.max}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
