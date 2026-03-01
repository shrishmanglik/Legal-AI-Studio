export interface LegalQARequest {
  question: string;
  jurisdiction: string;
}

export interface LegalQAResponse {
  question: string;
  answer: string;
  jurisdiction: string;
  sources: string[];
  cached: boolean;
}

export interface QAHistoryItem {
  id: string;
  question: string;
  answer: string;
  jurisdiction: string;
  created_at: string;
}
