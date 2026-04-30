export interface ClauseFound {
  clause_type: string;
  name: string;
  confidence: number;
  text_excerpt: string;
}

export interface ContractReview {
  id: string;
  filename: string;
  status: string;
  risk_score: number | null;
  summary: string | null;
  clauses_found: ClauseFound[];
  missing_clauses: string[];
  created_at: string;
}

export interface ClauseLibraryItem {
  id: string;
  clause_type: string;
  name: string;
  description: string;
  risk_level: string;
  example_text: string;
}
