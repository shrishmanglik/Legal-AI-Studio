"use client";

import { useState, useCallback, useEffect } from "react";
import { askQuestion, getHistory } from "@/lib/api/legal";
import type { LegalQAResponse, QAHistoryItem } from "@/types/legal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Send,
  AlertCircle,
  BookOpen,
  Clock,
  Loader2,
  Zap,
  ExternalLink,
} from "lucide-react";

const JURISDICTIONS = [
  { value: "federal", label: "Federal" },
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
];

export default function LegalQAPage() {
  const [question, setQuestion] = useState("");
  const [jurisdiction, setJurisdiction] = useState("federal");
  const [response, setResponse] = useState<LegalQAResponse | null>(null);
  const [history, setHistory] = useState<QAHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      setHistoryLoading(true);
      try {
        const data = await getHistory();
        if (!cancelled) setHistory(data);
      } catch {
        // History loading is non-critical; silently fail
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }
    loadHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAsk = useCallback(async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await askQuestion(question, jurisdiction);
      setResponse(res);
      // Refresh history
      try {
        const updatedHistory = await getHistory();
        setHistory(updatedHistory);
      } catch {
        // Non-critical
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [question, jurisdiction]);

  const handleHistoryClick = useCallback((item: QAHistoryItem) => {
    setQuestion(item.question);
    setResponse({
      question: item.question,
      answer: item.answer,
      jurisdiction: item.jurisdiction,
      sources: [],
      cached: true,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          Legal Q&A
        </h1>
        <p className="text-muted-foreground mt-2">
          Ask questions about Canadian law and get AI-powered answers with
          source references.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Q&A Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>
                Enter your legal question and select the relevant jurisdiction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g., What are the notice period requirements for terminating an employee in Ontario?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
              />
              <div className="flex gap-3">
                <Select
                  value={jurisdiction}
                  onValueChange={setJurisdiction}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    {JURISDICTIONS.map((j) => (
                      <SelectItem key={j.value} value={j.value}>
                        {j.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAsk}
                  disabled={loading || !question.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Ask Question
                    </>
                  )}
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

          {loading && !response && (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          )}

          {response && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Answer
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {response.cached && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Cached
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {JURISDICTIONS.find(
                        (j) => j.value === response.jurisdiction
                      )?.label || response.jurisdiction}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {response.answer}
                  </p>
                </div>

                {response.sources.length > 0 && (
                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium mb-2">Sources</h4>
                    <ul className="space-y-1">
                      {response.sources.map((source, idx) => (
                        <li key={idx}>
                          <a
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {source}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* History Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Recent Questions
          </h2>
          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-4 pb-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : history.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No previous questions yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer transition-colors hover:border-primary/50"
                  onClick={() => handleHistoryClick(item)}
                >
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-medium line-clamp-2">
                      {item.question}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {item.jurisdiction}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
