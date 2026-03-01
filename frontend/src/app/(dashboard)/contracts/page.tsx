"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { listReviews } from "@/lib/api/contracts";
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
import {
  FileText,
  Upload,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";

function statusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "processing":
      return <Badge variant="warning">Processing</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function statusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    case "processing":
      return <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
}

function riskColor(score: number | null) {
  if (score === null) return "text-muted-foreground";
  if (score >= 7) return "text-red-400";
  if (score >= 4) return "text-yellow-400";
  return "text-green-400";
}

export default function ContractsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<ContractReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listReviews();
        if (!cancelled) setReviews(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load reviews"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contract Reviews
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload and review contracts for potential risks and missing clauses.
          </p>
        </div>
        <Button onClick={() => router.push("/contracts/upload")}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Contract
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 pt-6">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No contracts yet</h2>
            <p className="text-muted-foreground text-center mb-6">
              Upload your first contract to get an AI-powered risk analysis.
            </p>
            <Button onClick={() => router.push("/contracts/upload")}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Contract
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <Card
              key={review.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => router.push(`/contracts/${review.id}`)}
            >
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="rounded-lg bg-primary/10 p-2">
                  {statusIcon(review.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{review.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()} &mdash;{" "}
                    {review.clauses_found.length} clauses found
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {review.risk_score !== null && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Risk</p>
                      <p
                        className={`text-lg font-bold ${riskColor(
                          review.risk_score
                        )}`}
                      >
                        {review.risk_score}/10
                      </p>
                    </div>
                  )}
                  {statusBadge(review.status)}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
