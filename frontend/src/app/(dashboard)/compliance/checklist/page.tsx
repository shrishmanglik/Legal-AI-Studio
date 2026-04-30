"use client";

import { useState, useCallback } from "react";
import { getChecklist } from "@/lib/api/compliance";
import type { ComplianceChecklist } from "@/types/compliance";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ClipboardList,
  Search,
  AlertCircle,
  CheckCircle2,
  Circle,
  Info,
} from "lucide-react";

const JURISDICTIONS = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
  { value: "FED", label: "Federal" },
];

const CATEGORIES = [
  { value: "employment", label: "Employment" },
  { value: "health_safety", label: "Health & Safety" },
  { value: "privacy", label: "Privacy" },
  { value: "corporate", label: "Corporate" },
  { value: "tax", label: "Tax" },
  { value: "environmental", label: "Environmental" },
];

export default function ComplianceChecklistPage() {
  const [jurisdiction, setJurisdiction] = useState("");
  const [category, setCategory] = useState("");
  const [checklist, setChecklist] = useState<ComplianceChecklist | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!jurisdiction || !category) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    setCompletedItems(new Set());
    try {
      const data = await getChecklist(jurisdiction, category);
      setChecklist(data);
      const initialCompleted = new Set<string>();
      data.items.forEach((item) => {
        if (item.completed) initialCompleted.add(item.id);
      });
      setCompletedItems(initialCompleted);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load checklist"
      );
    } finally {
      setLoading(false);
    }
  }, [jurisdiction, category]);

  const toggleItem = useCallback((id: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const totalItems = checklist?.items.length || 0;
  const completedCount = completedItems.size;
  const progressPercent =
    totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          Compliance Checklist
        </h1>
        <p className="text-muted-foreground mt-2">
          Generate and track compliance checklists by jurisdiction and category.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Checklist</CardTitle>
          <CardDescription>
            Select a jurisdiction and compliance category.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Jurisdiction</label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {JURISDICTIONS.map((j) => (
                    <SelectItem key={j.value} value={j.value}>
                      {j.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleSearch}
            disabled={!jurisdiction || !category || loading}
            className="w-full"
          >
            <Search className="mr-2 h-4 w-4" />
            {loading ? "Loading..." : "Generate Checklist"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
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
      )}

      {searched && !loading && checklist && checklist.items.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No checklist items found for this jurisdiction and category.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && checklist && checklist.items.length > 0 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">
                  {JURISDICTIONS.find((j) => j.value === checklist.jurisdiction)
                    ?.label || checklist.jurisdiction}{" "}
                  &mdash;{" "}
                  {CATEGORIES.find((c) => c.value === checklist.category)
                    ?.label || checklist.category}
                </h2>
                <Badge variant="secondary">
                  {completedCount}/{totalItems}
                </Badge>
              </div>
              <Progress value={progressPercent} />
            </CardContent>
          </Card>

          <div className="space-y-3">
            {checklist.items.map((item) => {
              const isComplete = completedItems.has(item.id);
              return (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-colors ${
                    isComplete
                      ? "border-green-500/30 bg-green-500/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <CardContent className="flex items-start gap-4 pt-6">
                    <div className="mt-0.5">
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          isComplete
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
