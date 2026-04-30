"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Download, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listTemplates, generateDocument } from "@/lib/api/documents";
import type { DocumentTemplate, GeneratedDocument } from "@/types/documents";

type WizardStep = "select" | "variables" | "result";

export function GenerationWizard() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("templateId");

  const [step, setStep] = useState<WizardStep>("select");
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeVariables = (template: DocumentTemplate) => {
    const schema = template.variables_schema;
    const initial: Record<string, string> = {};
    if (schema && typeof schema === "object") {
      const properties = (schema as Record<string, unknown>).properties as
        | Record<string, unknown>
        | undefined;
      if (properties) {
        Object.keys(properties).forEach((key) => {
          initial[key] = "";
        });
      }
    }
    setVariables(initial);
  };

  // Load templates on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await listTemplates();
        setTemplates(data);

        // If a template ID was preselected via query params, auto-select it
        if (preselectedId) {
          const found = data.find((t) => t.id === preselectedId);
          if (found) {
            setSelectedTemplate(found);
            initializeVariables(found);
            setStep("variables");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load templates");
      } finally {
        setTemplatesLoading(false);
      }
    }
    load();
  }, [preselectedId]);

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    initializeVariables(template);
    setError(null);
    setStep("variables");
  };

  const handleUpdateVariable = (key: string, value: string) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateDocument(selectedTemplate.id, variables);
      setGeneratedDoc(result);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep("select");
    setSelectedTemplate(null);
    setVariables({});
    setGeneratedDoc(null);
    setError(null);
  };

  const getVariableLabel = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const variableKeys = Object.keys(variables);
  const allVariablesFilled = variableKeys.every(
    (key) => variables[key].trim() !== ""
  );

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={handleStartOver}
          className={`font-medium ${
            step === "select" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          1. Select Template
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span
          className={`font-medium ${
            step === "variables" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          2. Fill Variables
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span
          className={`font-medium ${
            step === "result" ? "text-primary" : "text-muted-foreground"
          }`}
        >
          3. Download
        </span>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Step 1: Select Template */}
      {step === "select" && (
        <div className="space-y-4">
          {templatesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No templates available. Please check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer transition-colors hover:border-primary/50"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader>
                    <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      <Badge variant="outline">{template.jurisdiction}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Fill Variables */}
      {step === "variables" && selectedTemplate && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {selectedTemplate.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedTemplate.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedTemplate.category}</Badge>
                  <Badge variant="outline">{selectedTemplate.jurisdiction}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Variables</CardTitle>
              <CardDescription>
                Fill in all required fields to generate your document.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variableKeys.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This template has no variables. You can generate it directly.
                </p>
              ) : (
                variableKeys.map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{getVariableLabel(key)}</Label>
                    <Input
                      id={key}
                      value={variables[key]}
                      onChange={(e) => handleUpdateVariable(key, e.target.value)}
                      placeholder={`Enter ${getVariableLabel(key).toLowerCase()}`}
                    />
                  </div>
                ))
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("select")}>
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={loading || (variableKeys.length > 0 && !allVariablesFilled)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Document"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Result */}
      {step === "result" && generatedDoc && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Generated</CardTitle>
              <CardDescription>
                Your document has been generated successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{generatedDoc.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Ready for download
                  </p>
                </div>
                {generatedDoc.file_url && (
                  <a
                    href={generatedDoc.file_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </a>
                )}
              </div>

              {generatedDoc.content && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Preview</h3>
                  <div className="max-h-96 overflow-y-auto rounded-lg border bg-muted/30 p-4">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {generatedDoc.content}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleStartOver}>
                  Generate Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
