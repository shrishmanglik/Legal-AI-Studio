"use client";

import React from "react";
import { PathwayMatch } from "@/types/immigration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EligibilityBadge } from "./eligibility-badge";
import { formatProcessingTime } from "@/lib/utils/format";
import { Clock, ExternalLink, AlertCircle } from "lucide-react";

interface PathwayCardProps {
  match: PathwayMatch;
}

export function PathwayCard({ match }: PathwayCardProps) {
  const { program, eligibility, match_score, missing_requirements, notes } =
    match;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-mobile-lg">{program.name}</CardTitle>
            <p className="mt-1 text-mobile-xs text-muted-foreground">
              {program.category}
            </p>
          </div>
          <EligibilityBadge eligibility={eligibility} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-mobile-sm text-muted-foreground leading-relaxed">
          {program.description}
        </p>

        {/* Match score bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-mobile-xs">
            <span className="text-muted-foreground">Match Score</span>
            <span className="font-semibold text-foreground">
              {match_score}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                match_score >= 80
                  ? "bg-success"
                  : match_score >= 50
                  ? "bg-warning"
                  : "bg-destructive"
              }`}
              style={{ width: `${match_score}%` }}
            />
          </div>
        </div>

        {/* Processing time */}
        <div className="flex items-center gap-2 text-mobile-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Processing: {formatProcessingTime(program.processing_time_months)}
          </span>
        </div>

        {/* Missing requirements */}
        {missing_requirements.length > 0 && (
          <div className="rounded-lg bg-destructive/10 p-3">
            <div className="flex items-center gap-2 text-mobile-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4" />
              Missing Requirements
            </div>
            <ul className="mt-2 space-y-1">
              {missing_requirements.map((req, index) => (
                <li
                  key={index}
                  className="text-mobile-xs text-destructive/80 pl-6 relative before:content-['•'] before:absolute before:left-2"
                >
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <p className="text-mobile-xs text-muted-foreground italic">
            {notes}
          </p>
        )}

        {/* Link */}
        {program.url && (
          <a
            href={program.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-mobile-sm font-medium text-primary hover:underline active:opacity-80"
          >
            Learn more on IRCC
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
