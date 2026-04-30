import { z } from "zod";

const languageScoresSchema = z.object({
  speaking: z.number().min(0).max(12),
  listening: z.number().min(0).max(12),
  reading: z.number().min(0).max(12),
  writing: z.number().min(0).max(12),
});

export const calculatorSchema = z.object({
  // Core / Human Capital
  age: z.number().min(17, "Must be at least 17").max(45, "Must be 45 or under"),
  education_level: z.string().min(1, "Education level is required"),
  first_language: languageScoresSchema,
  second_language: languageScoresSchema.optional(),
  canadian_experience_years: z.number().min(0).max(10),

  // Spouse factors
  has_spouse: z.boolean(),
  spouse_education_level: z.string().optional(),
  spouse_language: languageScoresSchema.optional(),
  spouse_canadian_experience_years: z.number().min(0).max(5).optional(),

  // Skill transferability & additional
  foreign_experience_years: z.number().min(0).max(10),
  certificate_of_qualification: z.boolean(),
  provincial_nomination: z.boolean(),
  job_offer: z.boolean(),
  job_offer_noc_level: z.string().optional(),
  canadian_education: z.boolean(),
  canadian_education_level: z.string().optional(),
  siblings_in_canada: z.boolean(),
  french_proficiency: z.boolean(),
});

export type CalculatorFormData = z.infer<typeof calculatorSchema>;

export const educationLevels = [
  { value: "none", label: "No formal education" },
  { value: "high_school", label: "High school diploma" },
  { value: "one_year_diploma", label: "One-year diploma/certificate" },
  { value: "two_year_diploma", label: "Two-year diploma" },
  { value: "bachelors", label: "Bachelor's degree" },
  { value: "two_or_more_degrees", label: "Two or more degrees" },
  { value: "masters", label: "Master's degree" },
  { value: "phd", label: "Doctoral (PhD)" },
];

export const nocLevels = [
  { value: "noc_00", label: "NOC 00 - Senior management" },
  { value: "noc_0ab", label: "NOC 0, A, B - Skilled" },
  { value: "noc_cd", label: "NOC C, D - Semi/low-skilled" },
];
