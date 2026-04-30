"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
}

export function UploadDropzone({
  onFileSelect,
  accept = ".pdf,.docx",
  maxSize = 10 * 1024 * 1024,
}: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "docx"].includes(ext || "")) {
        setError("Only PDF and DOCX files are accepted");
        return false;
      }
      if (file.size > maxSize) {
        setError("File size must be under " + (maxSize / 1024 / 1024) + "MB");
        return false;
      }
      setError(null);
      return true;
    },
    [maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [validateFile, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Drop your contract here</p>
        <p className="text-sm text-muted-foreground mt-1">
          or click to browse (PDF, DOCX up to 10MB)
        </p>
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {selectedFile && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <FileText className="h-5 w-5 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => { setSelectedFile(null); setError(null); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
