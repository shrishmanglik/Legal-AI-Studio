"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EmploymentStandard } from "@/types/compliance";

interface StandardsTableProps {
  standards: EmploymentStandard[];
}

type SortField = "topic" | "effective_date";
type SortDirection = "asc" | "desc";

export function StandardsTable({ standards }: StandardsTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("topic");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = [...standards];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.topic.toLowerCase().includes(query) ||
          s.rule_text.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "topic") {
        comparison = a.topic.localeCompare(b.topic);
      } else if (sortField === "effective_date") {
        const dateA = a.effective_date || "";
        const dateB = b.effective_date || "";
        comparison = dateA.localeCompare(dateB);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [standards, search, sortField, sortDirection]);

  if (standards.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          No employment standards found for this province.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Filter standards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-semibold"
                    onClick={() => handleSort("topic")}
                  >
                    Topic
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Rule
                </th>
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-semibold"
                    onClick={() => handleSort("effective_date")}
                  >
                    Effective Date
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No standards match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((standard) => (
                  <tr
                    key={standard.id}
                    className="border-b transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">
                        {standard.topic}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-md text-sm text-muted-foreground">
                        {standard.rule_text}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {standard.effective_date
                          ? new Date(standard.effective_date).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {standard.source_url ? (
                        <a
                          href={standard.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">--</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {standards.length} standards
      </p>
    </div>
  );
}
