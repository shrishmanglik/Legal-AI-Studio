import { apiClient } from "./client";
import type { LegalQAResponse, QAHistoryItem } from "@/types/legal";

export async function askQuestion(
  question: string,
  jurisdiction: string
): Promise<LegalQAResponse> {
  return apiClient.post<LegalQAResponse>("/legal/qa", {
    question,
    jurisdiction,
  });
}

export async function getHistory(): Promise<QAHistoryItem[]> {
  return apiClient.get<QAHistoryItem[]>("/legal/qa/history");
}
