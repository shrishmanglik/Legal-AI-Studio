import { apiClient } from "./client";
import type { ContractReview, ClauseLibraryItem } from "@/types/contracts";

export async function uploadContract(file: File): Promise<{ id: string; filename: string; status: string }> {
  return apiClient.upload<{ id: string; filename: string; status: string }>("/contracts/upload", file);
}

export async function getReview(id: string): Promise<ContractReview> {
  return apiClient.get<ContractReview>(`/contracts/reviews/${id}`);
}

export async function listReviews(): Promise<ContractReview[]> {
  return apiClient.get<ContractReview[]>("/contracts/reviews");
}

export async function getClauseLibrary(): Promise<ClauseLibraryItem[]> {
  return apiClient.get<ClauseLibraryItem[]>("/contracts/clauses");
}
