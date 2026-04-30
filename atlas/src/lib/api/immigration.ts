import { apiClient } from "./client";
import {
  CRSInput,
  CRSResult,
  ImmigrationProgram,
  PathwayMatch,
  ChecklistItem,
} from "@/types/immigration";
import { ApiResponse } from "@/types/api";

export async function calculateCRS(
  input: CRSInput
): Promise<ApiResponse<CRSResult>> {
  return apiClient.post<ApiResponse<CRSResult>>(
    "/immigration/crs/calculate",
    input
  );
}

export async function getPrograms(): Promise<
  ApiResponse<ImmigrationProgram[]>
> {
  return apiClient.get<ApiResponse<ImmigrationProgram[]>>(
    "/immigration/programs"
  );
}

export async function matchPathways(
  input: CRSInput
): Promise<ApiResponse<PathwayMatch[]>> {
  return apiClient.post<ApiResponse<PathwayMatch[]>>(
    "/immigration/pathways/match",
    input
  );
}

export async function getChecklist(): Promise<ApiResponse<ChecklistItem[]>> {
  return apiClient.get<ApiResponse<ChecklistItem[]>>(
    "/immigration/checklist"
  );
}

export async function updateChecklistItem(
  id: string,
  is_completed: boolean
): Promise<ApiResponse<ChecklistItem>> {
  return apiClient.patch<ApiResponse<ChecklistItem>>(
    `/immigration/checklist/${id}`,
    { is_completed }
  );
}
