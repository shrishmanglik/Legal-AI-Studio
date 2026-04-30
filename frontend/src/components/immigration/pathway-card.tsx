"use client";

import { CheckCircle, XCircle, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PathwayMatch } from "@/types/immigration";

interface PathwayCardProps {
  match: PathwayMatch;
}

export function PathwayCard({ match }: PathwayCardProps) {
  const { program, eligible, match_score, notes } = match;

  return (
    <Card
      className={`transition-colors ${
        eligible ? "border-green-500/30" : "border-border"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{program.name}</CardTitle>
            <CardDescription>{program.province}</CardDescription>
          </div>
          {eligible ? (
            <Badge variant="success">
              <CheckCircle className="mr-1 h-3 w-3" />
              Eligible
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="mr-1 h-3 w-3" />
              Not Eligible
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Match Score</span>
          <span className="font-medium">{Math.round(match_score)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-all ${
              eligible ? "bg-green-500" : "bg-muted-foreground"
            }`}
            style={{ width: `${match_score}%` }}
          />
        </div>

        {program.min_crs_score !== null && (
          <div className="text-sm text-muted-foreground">
            Min CRS Score: <span className="font-medium">{program.min_crs_score}</span>
          </div>
        )}

        {notes.length > 0 && (
          <div className="space-y-1">
            {notes.map((note, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <Info className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}

        <Badge variant="secondary" className="text-xs">
          {program.program_type}
        </Badge>
      </CardContent>
    </Card>
  );
}
