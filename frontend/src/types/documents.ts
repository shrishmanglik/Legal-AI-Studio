export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  jurisdiction: string;
  variables_schema: Record<string, unknown>;
}

export interface GenerateRequest {
  template_id: string;
  variables: Record<string, string>;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  content: string;
  file_url: string | null;
}
