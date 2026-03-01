"use client";

import React from "react";
import { CRSResult } from "@/types/immigration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatScore } from "@/lib/utils/format";
import { ScoreBreakdown } from "./score-breakdown";
import { RotateCcw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CRSResultDisplayProps {
  result: CRSResult;
  onReset: () => void;
}

function getRatingConfig(rating: CRSResult["competitive_rating"]) {
  switch (rating) {
    case "highly_competitive":
      return {
        label: "Highly Competitive",
        variant: "success" as const,
        color: "text-success",
      };
    case "competitive":
      return {
        label: "Competitive",
        variant: "success" as const,
        color: "text-success",
      };
    case "moderate":
      return {
        label: "Moderate",
        variant: "warning" as const,
        color: "text-warning",
      };
    case "low":
      return {
        label: "Below Threshold",
        variant: "destructive" as const,
        color: "text-destructive",
      };
  }
}

export function CRSResultDisplay({ result, onReset }: CRSResultDisplayProps) {
  const ratingConfig = getRatingConfig(result.competitive_rating);

  return (
    <div className="space-y-5 pb-20">
      {/* Score display */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6">
          <div className="text-center">
            <p className="text-mobile-sm font-medium text-muted-foreground">
              Your CRS Score
            </p>
            <p className="mt-2 text-6xl font-bold tabular-nums text-foreground">
              {formatScore(result.score)}
            </p>
            <p className="mt-1 text-mobile-sm text-muted-foreground">
              out of 1,200
            </p>
            <div className="mt-3">
              <Badge variant={ratingConfig.variant} className="text-mobile-sm">
                {ratingConfig.label}
              </Badge>
            </div>
          </div>
        </div>

        <CardContent className="pt-5">
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
            <div>
              <p className="text-mobile-xs text-muted-foreground">
                Latest Express Entry Draw
              </p>
              <p className="text-mobile-lg font-semibold text-foreground">
                {formatScore(result.latest_draw_score)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-mobile-xs text-muted-foreground">Difference</p>
              <p
                className={`text-mobile-lg font-semibold ${
                  result.score >= result.latest_draw_score
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                {result.score >= result.latest_draw_score ? "+" : ""}
                {result.score - result.latest_draw_score}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <ScoreBreakdown breakdown={result.breakdown} />

      {/* Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-mobile-base text-muted-foreground leading-relaxed">
            {result.recommendation}
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button asChild size="lg" className="w-full">
          <Link href="/pathways">
            View Matching Pathways
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={onReset}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Recalculate
        </Button>
      </div>
    </div>
  );
}
