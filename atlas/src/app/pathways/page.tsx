"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { PathwayCard } from "@/components/pathways/pathway-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PathwayMatch } from "@/types/immigration";
import { getPrograms } from "@/lib/api/immigration";
import { ImmigrationProgram } from "@/types/immigration";
import { Compass, Filter, Loader2 } from "lucide-react";

type FilterCategory = "all" | "federal" | "provincial" | "pilot";

export default function PathwaysPage() {
  const [pathways, setPathways] = useState<PathwayMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterCategory>("all");

  useEffect(() => {
    async function loadPrograms() {
      try {
        const response = await getPrograms();
        // Convert programs to pathway matches for display
        const matches: PathwayMatch[] = response.data.map(
          (program: ImmigrationProgram) => ({
            program,
            eligibility: "likely" as const,
            match_score: 70,
            missing_requirements: [],
            notes: "Calculate your CRS score for a personalized assessment.",
          })
        );
        setPathways(matches);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load immigration programs"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPrograms();
  }, []);

  const filteredPathways =
    filter === "all"
      ? pathways
      : pathways.filter(
          (p) => p.program.category.toLowerCase() === filter
        );

  const filterOptions: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "All Programs" },
    { value: "federal", label: "Federal" },
    { value: "provincial", label: "Provincial" },
    { value: "pilot", label: "Pilot" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack title="Pathways" />

      <main className="flex-1 px-4 py-5">
        <div className="mx-auto max-w-lg space-y-5">
          {/* Header */}
          <div>
            <h1 className="text-mobile-2xl font-bold text-foreground">
              Immigration Pathways
            </h1>
            <p className="mt-1 text-mobile-sm text-muted-foreground">
              Explore programs that match your profile
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                size="sm"
                className="shrink-0"
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-mobile-sm text-muted-foreground">
              {filteredPathways.length} program
              {filteredPathways.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-3 text-mobile-sm text-muted-foreground">
                Loading programs...
              </p>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-mobile-sm text-destructive">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredPathways.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <Compass className="h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-mobile-base font-medium text-foreground">
                  No programs found
                </p>
                <p className="mt-1 text-mobile-sm text-muted-foreground">
                  Try adjusting your filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 pb-20">
              {filteredPathways.map((match) => (
                <PathwayCard key={match.program.id} match={match} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer className="pb-20" />
      <MobileNav />
    </div>
  );
}
