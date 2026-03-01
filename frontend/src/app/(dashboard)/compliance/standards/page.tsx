"use client";

import { useState, useCallback } from "react";
import { getStandards } from "@/lib/api/compliance";
import type { EmploymentStandard } from "@/types/compliance";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  AlertCircle,
  ExternalLink,
  Info,
} from "lucide-react";

const PROVINCES = [
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

export default function ComplianceStandardsPage() {
  const [province, setProvince] = useState("");
  const [standards, setStandards] = useState<EmploymentStandard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!province) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await getStandards(province);
      setStandards(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load standards"
      );
    } finally {
      setLoading(false);
    }
  }, [province]);

  const selectedProvLabel =
    PROVINCES.find((p) => p.value === province)?.label || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Employment Standards
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse employment standards by province or territory.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Jurisdiction</CardTitle>
          <CardDescription>
            Choose a province, territory, or federal jurisdiction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select province or territory" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={!province || loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Loading..." : "Search"}
            </Button>
          </div>
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
        <Card>
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-6 w-48" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {searched && !loading && standards.length === 0 && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No employment standards found for {selectedProvLabel}.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && standards.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Standards for {selectedProvLabel}
          </h2>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Topic
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Rule
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Effective Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {standards.map((standard) => (
                  <tr
                    key={standard.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium">
                      {standard.topic}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {standard.rule_text}
                    </td>
                    <td className="px-4 py-3">
                      {standard.effective_date ? (
                        <Badge variant="outline" className="text-xs">
                          {new Date(
                            standard.effective_date
                          ).toLocaleDateString()}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {standard.source_url ? (
                        <a
                          href={standard.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
