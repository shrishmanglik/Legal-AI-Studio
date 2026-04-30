"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { crsInputSchema } from "@/lib/validations/immigration";
import type { CRSInput } from "@/types/immigration";

const EDUCATION_LEVELS = [
  { value: "none", label: "Less than secondary school" },
  { value: "secondary", label: "Secondary diploma (high school)" },
  { value: "one_year_post_secondary", label: "One-year post-secondary" },
  { value: "two_year_post_secondary", label: "Two-year post-secondary" },
  { value: "bachelors", label: "Bachelor's degree" },
  { value: "two_or_more_post_secondary", label: "Two or more post-secondary" },
  { value: "masters", label: "Master's degree" },
  { value: "doctoral", label: "Doctoral degree (PhD)" },
];

const STEP_TITLES = [
  "Personal Information",
  "Education",
  "Language Proficiency",
  "Work Experience",
  "Additional Factors",
];

interface CRSFormProps {
  calculator: {
    input: CRSInput;
    step: number;
    totalSteps: number;
    loading: boolean;
    error: string | null;
    updateInput: (updates: Partial<CRSInput>) => void;
    nextStep: () => void;
    prevStep: () => void;
    calculate: () => Promise<unknown>;
  };
}

export function CRSForm({ calculator }: CRSFormProps) {
  const { input, step, totalSteps, loading, error, updateInput, nextStep, prevStep, calculate } =
    calculator;

  const handleCalculate = async () => {
    await calculate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Step {step + 1} of {totalSteps}: {STEP_TITLES[step]}
        </CardTitle>
        <CardDescription>
          Fill in your information to calculate your CRS score.
        </CardDescription>
        {/* Step indicator */}
        <div className="flex gap-1 pt-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Step 0: Personal */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={18}
                max={65}
                value={input.age}
                onChange={(e) => updateInput({ age: parseInt(e.target.value) || 18 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Select
                value={input.has_spouse ? "yes" : "no"}
                onValueChange={(v) => updateInput({ has_spouse: v === "yes" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Single / Not Married</SelectItem>
                  <SelectItem value="yes">Married / Common-Law Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 1: Education */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Education Level</Label>
              <Select
                value={input.education_level}
                onValueChange={(v) => updateInput({ education_level: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="canadian_education">
                Years of Canadian Education
              </Label>
              <Input
                id="canadian_education"
                type="number"
                min={0}
                max={10}
                value={input.canadian_education_years}
                onChange={(e) =>
                  updateInput({
                    canadian_education_years: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            {input.has_spouse && (
              <div className="space-y-2">
                <Label>Spouse Education Level</Label>
                <Select
                  value={input.spouse_education_level || "none"}
                  onValueChange={(v) =>
                    updateInput({ spouse_education_level: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Language */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">First Official Language (CLB)</h3>
              <div className="grid grid-cols-2 gap-4">
                {(["speaking", "listening", "reading", "writing"] as const).map(
                  (skill) => (
                    <div key={skill} className="space-y-2">
                      <Label className="capitalize">{skill}</Label>
                      <Input
                        type="number"
                        min={0}
                        max={12}
                        value={input.first_language[skill]}
                        onChange={(e) =>
                          updateInput({
                            first_language: {
                              ...input.first_language,
                              [skill]: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Second Official Language (CLB, optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                {(["speaking", "listening", "reading", "writing"] as const).map(
                  (skill) => (
                    <div key={skill} className="space-y-2">
                      <Label className="capitalize">{skill}</Label>
                      <Input
                        type="number"
                        min={0}
                        max={12}
                        value={input.second_language?.[skill] ?? 0}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const current = input.second_language || {
                            speaking: 0,
                            listening: 0,
                            reading: 0,
                            writing: 0,
                          };
                          updateInput({
                            second_language: { ...current, [skill]: val },
                          });
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Work Experience */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="canadian_work">
                Canadian Work Experience (years)
              </Label>
              <Input
                id="canadian_work"
                type="number"
                min={0}
                max={30}
                value={input.canadian_work_experience_years}
                onChange={(e) =>
                  updateInput({
                    canadian_work_experience_years:
                      parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foreign_work">
                Foreign Work Experience (years)
              </Label>
              <Input
                id="foreign_work"
                type="number"
                min={0}
                max={30}
                value={input.foreign_work_experience_years}
                onChange={(e) =>
                  updateInput({
                    foreign_work_experience_years:
                      parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            {input.has_spouse && (
              <div className="space-y-2">
                <Label htmlFor="spouse_work">
                  Spouse Canadian Work Experience (years)
                </Label>
                <Input
                  id="spouse_work"
                  type="number"
                  min={0}
                  max={30}
                  value={input.spouse_canadian_work_years}
                  onChange={(e) =>
                    updateInput({
                      spouse_canadian_work_years:
                        parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Additional */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>Provincial Nomination</Label>
              <input
                type="checkbox"
                checked={input.has_provincial_nomination}
                onChange={(e) =>
                  updateInput({ has_provincial_nomination: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>Certificate of Qualification</Label>
              <input
                type="checkbox"
                checked={input.has_certificate_of_qualification}
                onChange={(e) =>
                  updateInput({
                    has_certificate_of_qualification: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-input"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>Sibling in Canada</Label>
              <input
                type="checkbox"
                checked={input.has_sibling_in_canada}
                onChange={(e) =>
                  updateInput({ has_sibling_in_canada: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>French CLB 7+</Label>
              <input
                type="checkbox"
                checked={input.french_clb7_plus}
                onChange={(e) =>
                  updateInput({ french_clb7_plus: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>English CLB 5+</Label>
              <input
                type="checkbox"
                checked={input.english_clb5_plus}
                onChange={(e) =>
                  updateInput({ english_clb5_plus: e.target.checked })
                }
                className="h-4 w-4 rounded border-input"
              />
            </div>
            <div className="space-y-2">
              <Label>Job Offer NOC Level</Label>
              <Select
                value={input.job_offer_noc_level || "none"}
                onValueChange={(v) =>
                  updateInput({
                    job_offer_noc_level: v === "none" ? null : v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No job offer</SelectItem>
                  <SelectItem value="noc_00">NOC 00</SelectItem>
                  <SelectItem value="noc_0_a_b">NOC 0, A, or B</SelectItem>
                  <SelectItem value="noc_c_d">NOC C or D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 0}
          >
            Previous
          </Button>
          {step < totalSteps - 1 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleCalculate} disabled={loading}>
              {loading ? "Calculating..." : "Calculate CRS Score"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
