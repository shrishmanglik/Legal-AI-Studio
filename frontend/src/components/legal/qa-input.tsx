"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QAInputProps {
  onSubmit: (question: string, jurisdiction: string) => void;
  loading: boolean;
}

const JURISDICTIONS = [
  "Federal",
  "Ontario",
  "British Columbia",
  "Alberta",
  "Quebec",
  "Manitoba",
  "Saskatchewan",
  "New Brunswick",
  "Nova Scotia",
  "Prince Edward Island",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

export function QAInput({ onSubmit, loading }: QAInputProps) {
  const [question, setQuestion] = useState("");
  const [jurisdiction, setJurisdiction] = useState("Ontario");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    onSubmit(question.trim(), jurisdiction);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ask a Legal Question</CardTitle>
        <CardDescription>
          Get AI-powered analysis with relevant legal sources. Responses are for
          informational purposes only and do not constitute legal advice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jurisdiction">Jurisdiction</Label>
            <Select value={jurisdiction} onValueChange={setJurisdiction}>
              <SelectTrigger id="jurisdiction" className="w-64">
                <SelectValue placeholder="Select jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                {JURISDICTIONS.map((j) => (
                  <SelectItem key={j} value={j}>
                    {j}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea
              id="question"
              placeholder="e.g., What are the notice requirements for terminating an employee in Ontario?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Press Shift+Enter for a new line, Enter to submit.
            </p>
          </div>

          <Button
            type="submit"
            disabled={!question.trim() || loading}
          >
            {loading ? (
              "Analyzing..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Ask Question
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
