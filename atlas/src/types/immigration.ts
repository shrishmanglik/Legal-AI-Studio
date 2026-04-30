export interface LanguageScores {
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
}

export interface CRSInput {
  // Core / Human Capital
  age: number;
  education_level: string;
  first_language: LanguageScores;
  second_language?: LanguageScores;
  canadian_experience_years: number;

  // Spouse factors
  has_spouse: boolean;
  spouse_education_level?: string;
  spouse_language?: LanguageScores;
  spouse_canadian_experience_years?: number;

  // Skill transferability & additional
  foreign_experience_years: number;
  certificate_of_qualification: boolean;
  provincial_nomination: boolean;
  job_offer: boolean;
  job_offer_noc_level?: string;
  canadian_education: boolean;
  canadian_education_level?: string;
  siblings_in_canada: boolean;
  french_proficiency: boolean;
}

export interface CRSBreakdown {
  core_human_capital: number;
  spouse_factors: number;
  skill_transferability: number;
  additional_points: number;
  total: number;
}

export interface CRSResult {
  score: number;
  breakdown: CRSBreakdown;
  competitive_rating: "low" | "moderate" | "competitive" | "highly_competitive";
  latest_draw_score: number;
  recommendation: string;
}

export interface ImmigrationProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  processing_time_months: number;
  min_crs_score?: number;
  requirements: string[];
  url: string;
}

export interface PathwayMatch {
  program: ImmigrationProgram;
  eligibility: "eligible" | "likely" | "unlikely";
  match_score: number;
  missing_requirements: string[];
  notes: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  is_completed: boolean;
  order: number;
  due_date?: string;
  url?: string;
  dependencies?: string[];
}
