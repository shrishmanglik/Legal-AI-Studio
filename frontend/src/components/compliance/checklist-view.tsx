"use client";

import { useState } from "react";
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ComplianceChecklist } from "@/types/compliance";

interface ChecklistViewProps {
  checklist: ComplianceChecklist;
}

export function ChecklistView({ checklist }: ChecklistViewProps) {
  const [items, setItems] = useState(checklist.items);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header card with progress */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                {checklist.category} Compliance
              </CardTitle>
              <CardDescription>
                {checklist.jurisdiction} jurisdiction
              </CardDescription>
            </div>
            <Badge
              variant={
                progressPercent === 100
                  ? "success"
                  : progressPercent > 50
                  ? "warning"
                  : "secondary"
              }
            >
              {completedCount} / {totalCount} complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Checklist items */}
      {items.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            No checklist items available for this selection.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-colors hover:border-primary/30 ${
                item.completed ? "border-green-500/30 bg-green-500/5" : ""
              }`}
              onClick={() => handleToggle(item.id)}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className="mt-0.5 shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`text-sm font-medium ${
                      item.completed
                        ? "text-muted-foreground line-through"
                        : ""
                    }`}
                  >
                    {item.label}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
