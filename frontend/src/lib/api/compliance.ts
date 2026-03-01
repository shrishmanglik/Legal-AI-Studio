import { apiClient } from "./client";
import type { EmploymentStandard, ComplianceChecklist } from "@/types/compliance";

export async function getStandards(province: string): Promise<EmploymentStandard[]> {
  return apiClient.get<EmploymentStandard[]>(`/compliance/standards?province=${encodeURIComponent(province)}`);
}

export async function getChecklist(
  jurisdiction: string,
  category: string
): Promise<ComplianceChecklist> {
  return apiClient.get<ComplianceChecklist>(
    `/compliance/checklist?jurisdiction=${encodeURIComponent(jurisdiction)}&category=${encodeURIComponent(category)}`
  );
}
