"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClauseCardProps {
  clauseType: string;
  name: string;
  confidence: number;
  textExcerpt: string;
}

export function ClauseCard({ clauseType, name, confidence, textExcerpt }: ClauseCardProps) {
  const confidenceColor =
    confidence >= 0.8 ? "text-green-400" : confidence >= 0.5 ? "text-yellow-400" : "text-red-400";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <Badge variant="outline">{clauseType}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">&ldquo;{textExcerpt}&rdquo;</p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Confidence:</span>
          <span className={confidenceColor}>{(confidence * 100).toFixed(0)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
