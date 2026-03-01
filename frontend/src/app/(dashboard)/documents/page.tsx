"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { listTemplates } from "@/lib/api/documents";
import type { DocumentTemplate } from "@/types/documents";
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
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  ArrowRight,
  AlertCircle,
  FolderOpen,
} from "lucide-react";

export default function DocumentsPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await listTemplates();
        if (!cancelled) setTemplates(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load templates"
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

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(filtered.map((t) => t.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-2">
            Browse legal document templates and generate customized documents.
          </p>
        </div>
        <Button onClick={() => router.push("/documents/generate")}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Document
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates by name, category, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20 mt-1" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No templates found</h2>
            <p className="text-muted-foreground text-center">
              {search
                ? "Try adjusting your search terms."
                : "No document templates are available."}
            </p>
          </CardContent>
        </Card>
      ) : (
        categories.map((category) => (
          <div key={category} className="space-y-3">
            <h2 className="text-lg font-semibold">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered
                .filter((t) => t.category === category)
                .map((template) => (
                  <Card
                    key={template.id}
                    className="group cursor-pointer transition-colors hover:border-primary/50"
                    onClick={() =>
                      router.push(
                        `/documents/generate?templateId=${template.id}`
                      )
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {template.jurisdiction}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                      <Button
                        variant="ghost"
                        className="mt-3 px-0 text-primary group-hover:translate-x-1 transition-transform"
                      >
                        Use template{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
