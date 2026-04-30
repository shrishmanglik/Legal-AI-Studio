"use client";

import { useState, useCallback } from "react";
import { matchPathways } from "@/lib/api/immigration";
import type { CRSInput, PathwayMatch } from "@/types/immigration";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  GitBranch,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react";

const EDUCATION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "secondary", label: "Secondary School" },
  { value: "one_year", label: "One-Year Program" },
  { value: "two_year", label: "Two-Year Program" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "two_or_more", label: "Two or More Certificates" },
  { value: "masters", label: "Master's Degree" },
  { value: "doctoral", label: "Doctoral (PhD)" },
];

export default function PathwaysPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PathwayMatch[] | null>(null);

  const [age, setAge] = useState(25);
  const [education, setEducation] = useState("bachelors");
  const [canadianWorkYears, setCanadianWorkYears] = useState(0);
  const [foreignWorkYears, setForeignWorkYears] = useState(0);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const input: CRSInput = {
        age,
        has_spouse: false,
        education_level: education,
        first_language: { speaking: 7, listening: 7, reading: 7, writing: 7 },
        second_language: null,
        canadian_work_experience_years: canadianWorkYears,
        foreign_work_experience_years: foreignWorkYears,
        spouse_education_level: null,
        spouse_language: null,
        spouse_canadian_work_years: 0,
        has_certificate_of_qualification: false,
        has_provincial_nomination: false,
        job_offer_noc_level: null,
        canadian_education_years: 0,
        has_sibling_in_canada: false,
        french_clb7_plus: false,
        english_clb5_plus: false,
      };
      const matches = await matchPathways(input);
      setResults(matches);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to find matching pathways"
      );
    } finally {
      setLoading(false);
    }
  }, [age, education, canadianWorkYears, foreignWorkYears]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-primary" />
          Pathway Finder
        </h1>
        <p className="text-muted-foreground mt-2">
          Find immigration pathways that match your profile.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Enter basic details to find matching programs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pw-age">Age</Label>
              <Input
                id="pw-age"
                type="number"
                min={18}
                max={65}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 18)}
              />
            </div>
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select value={education} onValueChange={setEducation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw-can-work">
                Canadian Work Experience (years)
              </Label>
              <Input
                id="pw-can-work"
                type="number"
                min={0}
                max={10}
                value={canadianWorkYears}
                onChange={(e) =>
                  setCanadianWorkYears(parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw-for-work">
                Foreign Work Experience (years)
              </Label>
              <Input
                id="pw-for-work"
                type="number"
                min={0}
                max={10}
                value={foreignWorkYears}
                onChange={(e) =>
                  setForeignWorkYears(parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading} className="w-full">
            <Search className="mr-2 h-4 w-4" />
            {loading ? "Searching..." : "Find Matching Pathways"}
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
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32 mt-1" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results && !loading && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {results.length} Pathway{results.length !== 1 ? "s" : ""} Found
          </h2>
          {results.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Info className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No matching pathways found. Try adjusting your profile.
                </p>
              </CardContent>
            </Card>
          )}
          {results.map((match, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {match.eligible ? (
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      {match.program.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {match.program.province} &mdash;{" "}
                      {match.program.program_type}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={match.eligible ? "success" : "secondary"}
                    >
                      {match.eligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      Match: {Math.round(match.match_score * 100)}%
                    </p>
                  </div>
                </div>
              </CardHeader>
              {match.notes.length > 0 && (
                <CardContent>
                  <ul className="space-y-1">
                    {match.notes.map((note, nIdx) => (
                      <li
                        key={nIdx}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Info className="h-4 w-4 mt-0.5 shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
