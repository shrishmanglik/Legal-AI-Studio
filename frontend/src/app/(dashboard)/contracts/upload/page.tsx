"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { uploadContract } from "@/lib/api/contracts";
import { UploadDropzone } from "@/components/contracts/upload-dropzone";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function ContractUploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    id: string;
    filename: string;
    status: string;
  } | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);
    setUploadResult(null);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadContract(selectedFile);
      setUploadResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload contract"
      );
    } finally {
      setUploading(false);
    }
  }, [selectedFile]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/contracts")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contracts
        </Button>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Upload className="h-8 w-8 text-primary" />
          Upload Contract
        </h1>
        <p className="text-muted-foreground mt-2">
          Upload a contract document for AI-powered review and risk analysis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Document</CardTitle>
          <CardDescription>
            Supported formats: PDF and DOCX. Maximum file size: 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadDropzone onFileSelect={handleFileSelect} />

          {selectedFile && !uploadResult && (
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Analyze
                </>
              )}
            </Button>
          )}

          {uploading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Uploading and processing...
              </p>
              <Progress value={65} />
            </div>
          )}
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

      {uploadResult && (
        <Card className="border-green-500/30">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <div>
                <p className="font-medium">Upload Successful</p>
                <p className="text-sm text-muted-foreground">
                  {uploadResult.filename} has been uploaded and is being
                  processed.
                </p>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(`/contracts/${uploadResult.id}`)
              }
              className="w-full"
            >
              View Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
