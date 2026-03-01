export interface EmploymentStandard {
  id: string;
  province: string;
  topic: string;
  rule_text: string;
  effective_date: string | null;
  source_url: string | null;
}

export interface ComplianceRule {
  id: string;
  jurisdiction: string;
  category: string;
  rule_name: string;
  description: string;
  checklist_items: Record<string, unknown>;
}

export interface ComplianceChecklist {
  jurisdiction: string;
  category: string;
  items: Array<{
    id: string;
    label: string;
    description: string;
    completed: boolean;
  }>;
}
