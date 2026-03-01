"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  listTemplates,
  getTemplate,
  generateDocument,
} from "@/lib/api/documents";
import type { DocumentTemplate, GeneratedDocument } from "@/types/documents";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
} from "lucide-react";

const WIZARD_STEPS = ["Select Template", "Fill Variables", "Review & Generate"];

export default function DocumentGeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("templateId");

  const [step, setStep] = useState(preselectedId ? 1 : 0);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DocumentTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setTemplatesLoading(true);
      try {
        if (preselectedId) {
          const tmpl = await getTemplate(preselectedId);
          if (!cancelled) {
            setSelectedTemplate(tmpl);
            initVariables(tmpl);
          }
        }
        const all = await listTemplates();
        if (!cancelled) setTemplates(all);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load templates"
          );
      } finally {
        if (!cancelled) setTemplatesLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [preselectedId]);

  function initVariables(tmpl: DocumentTemplate) {
    const schema = tmpl.variables_schema as Record<
      string,
      { type?: string; default?: string }
    >;
    const vars: Record<string, string> = {};
    Object.keys(schema).forEach((key) => {
      vars[key] = (schema[key]?.default as string) || "";
    });
    setVariables(vars);
  }

  const handleTemplateSelect = useCallback(
    async (templateId: string) => {
      setError(null);
      setLoading(true);
      try {
        const tmpl = await getTemplate(templateId);
        setSelectedTemplate(tmpl);
        initVariables(tmpl);
        setStep(1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load template"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleGenerate = useCallback(async () => {
    if (!selectedTemplate) return;
    setLoading(true);
    setError(null);
    try {
      const doc = await generateDocument(selectedTemplate.id, variables);
      setGeneratedDoc(doc);
      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate document"
      );
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate, variables]);

  const variableKeys = selectedTemplate
    ? Object.keys(
        selectedTemplate.variables_schema as Record<string, unknown>
      )
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/documents")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Documents
        </Button>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Generate Document
        </h1>
        <p className="text-muted-foreground mt-2">
          Select a template, fill in the details, and generate your document.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {WIZARD_STEPS.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                idx <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {idx + 1}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                idx <= step ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {idx < WIZARD_STEPS.length - 1 && (
              <div className="h-px w-8 bg-border" />
            )}
          </div>
        ))}
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Step 0: Select Template */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select a Template</CardTitle>
            <CardDescription>
              Choose a document template to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {templatesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {templates.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer transition-colors hover:border-primary/50"
                    onClick={() => handleTemplateSelect(tmpl.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{tmpl.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {tmpl.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="text-xs text-muted-foreground">
                        {tmpl.jurisdiction}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 1: Fill Variables */}
      {step === 1 && selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTemplate.name}</CardTitle>
            <CardDescription>{selectedTemplate.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {variableKeys.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This template has no variables to fill in.
              </p>
            ) : (
              variableKeys.map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`var-${key}`} className="capitalize">
                    {key.replace(/_/g, " ")}
                  </Label>
                  <Input
                    id={`var-${key}`}
                    value={variables[key] || ""}
                    onChange={(e) =>
                      setVariables((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={`Enter ${key.replace(/_/g, " ")}`}
                  />
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Result */}
      {step === 2 && generatedDoc && (
        <Card className="border-green-500/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <CardTitle>Document Generated</CardTitle>
            </div>
            <CardDescription>{generatedDoc.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">
                {generatedDoc.content}
              </pre>
            </div>
            {generatedDoc.file_url && (
              <Button asChild className="w-full">
                <a href={generatedDoc.file_url} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Document
                </a>
              </Button>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStep(0);
                setSelectedTemplate(null);
                setGeneratedDoc(null);
                setVariables({});
              }}
              className="w-full"
            >
              Generate Another Document
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
