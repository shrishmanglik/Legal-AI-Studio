import { z } from "zod";

const languageScoresSchema = z.object({
  speaking: z
    .number()
    .min(0, "Score must be at least 0")
    .max(12, "Score cannot exceed 12"),
  listening: z
    .number()
    .min(0, "Score must be at least 0")
    .max(12, "Score cannot exceed 12"),
  reading: z
    .number()
    .min(0, "Score must be at least 0")
    .max(12, "Score cannot exceed 12"),
  writing: z
    .number()
    .min(0, "Score must be at least 0")
    .max(12, "Score cannot exceed 12"),
});

export const crsInputSchema = z.object({
  age: z
    .number()
    .min(18, "Minimum age is 18")
    .max(65, "Maximum age is 65"),
  has_spouse: z.boolean(),
  education_level: z.enum(
    [
      "none",
      "secondary",
      "one_year_post_secondary",
      "two_year_post_secondary",
      "bachelors",
      "two_or_more_post_secondary",
      "masters",
      "doctoral",
    ],
    { required_error: "Education level is required" }
  ),
  first_language: languageScoresSchema,
  second_language: languageScoresSchema.nullable().optional(),
  canadian_work_experience_years: z
    .number()
    .min(0, "Cannot be negative")
    .max(30, "Maximum is 30 years"),
  foreign_work_experience_years: z
    .number()
    .min(0, "Cannot be negative")
    .max(30, "Maximum is 30 years"),
  spouse_education_level: z
    .enum([
      "none",
      "secondary",
      "one_year_post_secondary",
      "two_year_post_secondary",
      "bachelors",
      "two_or_more_post_secondary",
      "masters",
      "doctoral",
    ])
    .nullable()
    .optional(),
  spouse_language: languageScoresSchema.nullable().optional(),
  spouse_canadian_work_years: z
    .number()
    .min(0, "Cannot be negative")
    .max(30, "Maximum is 30 years"),
  has_certificate_of_qualification: z.boolean(),
  has_provincial_nomination: z.boolean(),
  job_offer_noc_level: z
    .enum(["noc_00", "noc_0_a_b", "noc_c_d"])
    .nullable()
    .optional(),
  canadian_education_years: z
    .number()
    .min(0, "Cannot be negative")
    .max(10, "Maximum is 10 years"),
  has_sibling_in_canada: z.boolean(),
  french_clb7_plus: z.boolean(),
  english_clb5_plus: z.boolean(),
});

export type CRSInputFormData = z.infer<typeof crsInputSchema>;
