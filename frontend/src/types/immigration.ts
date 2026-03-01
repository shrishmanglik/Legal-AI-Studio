export interface LanguageScores {
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
}

export interface CRSInput {
  age: number;
  has_spouse: boolean;
  education_level: string;
  first_language: LanguageScores;
  second_language?: LanguageScores | null;
  canadian_work_experience_years: number;
  foreign_work_experience_years: number;
  spouse_education_level?: string | null;
  spouse_language?: LanguageScores | null;
  spouse_canadian_work_years: number;
  has_certificate_of_qualification: boolean;
  has_provincial_nomination: boolean;
  job_offer_noc_level?: string | null;
  canadian_education_years: number;
  has_sibling_in_canada: boolean;
  french_clb7_plus: boolean;
  english_clb5_plus: boolean;
}

export interface CRSBreakdown {
  core_human_capital: number;
  spouse_factors: number;
  skill_transferability: number;
  additional_points: number;
}

export interface CRSResult {
  total_score: number;
  breakdown: CRSBreakdown;
  max_score: number;
}

export interface ImmigrationProgram {
  id: string;
  name: string;
  province: string;
  program_type: string;
  min_crs_score: number | null;
  requirements: Record<string, unknown>;
  active: boolean;
}

export interface PathwayMatch {
  program: ImmigrationProgram;
  eligible: boolean;
  match_score: number;
  notes: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  order: number;
  is_completed: boolean;
}

export interface EEDraw {
  id: string;
  draw_number: number;
  draw_date: string;
  min_score: number;
  invitations: number;
  program_type: string;
}
