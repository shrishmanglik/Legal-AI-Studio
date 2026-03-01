import { apiClient } from "./client";
import type { DocumentTemplate, GeneratedDocument } from "@/types/documents";

export async function listTemplates(): Promise<DocumentTemplate[]> {
  return apiClient.get<DocumentTemplate[]>("/documents/templates");
}

export async function getTemplate(id: string): Promise<DocumentTemplate> {
  return apiClient.get<DocumentTemplate>(`/documents/templates/${id}`);
}

export async function generateDocument(
  templateId: string,
  variables: Record<string, string>
): Promise<GeneratedDocument> {
  return apiClient.post<GeneratedDocument>("/documents/generate", {
    template_id: templateId,
    variables,
  });
}
