"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getReview } from "@/lib/api/contracts";
import type { ContractReview } from "@/types/contracts";
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
  ArrowLeft,
  FileText,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function riskLabel(score: number) {
  if (score >= 7) return { text: "High Risk", variant: "destructive" as const, icon: ShieldAlert };
  if (score >= 4) return { text: "Medium Risk", variant: "warning" as const, icon: AlertTriangle };
  return { text: "Low Risk", variant: "success" as const, icon: ShieldCheck };
}

export default function ContractReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [review, setReview] = useState<ContractReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getReview(id);
        if (!cancelled) setReview(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load review"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/contracts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!review) return null;

  const risk = review.risk_score !== null ? riskLabel(review.risk_score) : null;
  const RiskIcon = risk?.icon || ShieldCheck;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/contracts")}
        className="mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Contracts
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {review.filename}
            </h1>
            <p className="text-sm text-muted-foreground">
              Uploaded {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        {risk && (
          <Badge variant={risk.variant} className="text-sm px-3 py-1">
            <RiskIcon className="h-4 w-4 mr-1" />
            {risk.text}
          </Badge>
        )}
      </div>

      {review.risk_score !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold text-primary">
                {review.risk_score}
              </span>
              <span className="text-2xl text-muted-foreground mb-1">/10</span>
            </div>
            <Progress value={review.risk_score * 10} />
          </CardContent>
        </Card>
      )}

      {review.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {review.summary}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Clauses Found
            </CardTitle>
            <CardDescription>
              {review.clauses_found.length} clause
              {review.clauses_found.length !== 1 ? "s" : ""} identified
            </CardDescription>
          </CardHeader>
          <CardContent>
            {review.clauses_found.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No clauses identified.
              </p>
            ) : (
              <div className="space-y-3">
                {review.clauses_found.map((clause, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{clause.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(clause.confidence * 100)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {clause.clause_type}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {clause.text_excerpt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              Missing Clauses
            </CardTitle>
            <CardDescription>
              {review.missing_clauses.length} missing clause
              {review.missing_clauses.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {review.missing_clauses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No missing clauses detected.
              </p>
            ) : (
              <ul className="space-y-2">
                {review.missing_clauses.map((clause, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-border p-3"
                  >
                    <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0" />
                    <span className="text-sm">{clause}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
