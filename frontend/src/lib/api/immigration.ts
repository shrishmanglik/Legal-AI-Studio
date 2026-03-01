import { apiClient } from "./client";
import type { CRSInput, CRSResult, ImmigrationProgram, PathwayMatch, ChecklistItem, EEDraw } from "@/types/immigration";

export async function calculateCRS(input: CRSInput): Promise<CRSResult> {
  return apiClient.post<CRSResult>("/immigration/crs/calculate", input);
}

export async function getPrograms(): Promise<ImmigrationProgram[]> {
  return apiClient.get<ImmigrationProgram[]>("/immigration/programs");
}

export async function matchPathways(input: CRSInput): Promise<PathwayMatch[]> {
  return apiClient.post<PathwayMatch[]>("/immigration/pathways/match", input);
}

export async function getChecklist(): Promise<ChecklistItem[]> {
  return apiClient.get<ChecklistItem[]>("/immigration/checklist");
}

export async function toggleChecklistItem(id: string, completed: boolean): Promise<ChecklistItem> {
  return apiClient.put<ChecklistItem>(`/immigration/checklist/${id}`, { is_completed: completed });
}

export async function getDraws(): Promise<EEDraw[]> {
  return apiClient.get<EEDraw[]>("/immigration/draws");
}
