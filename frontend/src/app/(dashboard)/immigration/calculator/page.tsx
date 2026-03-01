"use client";

import { useCRSCalculator } from "@/lib/hooks/use-crs-calculator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

const EDUCATION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "secondary", label: "Secondary School" },
  { value: "one_year", label: "One-Year Program" },
  { value: "two_year", label: "Two-Year Program" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "two_or_more", label: "Two or More Certificates" },
  { value: "masters", label: "Master's Degree" },
  { value: "doctoral", label: "Doctoral (PhD)" },
];

const STEP_LABELS = [
  "Personal Info",
  "Education",
  "Language",
  "Work Experience",
  "Additional Factors",
];

function LanguageScoreInputs({
  prefix,
  scores,
  onChange,
}: {
  prefix: string;
  scores: { speaking: number; listening: number; reading: number; writing: number };
  onChange: (field: string, value: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {(["speaking", "listening", "reading", "writing"] as const).map((skill) => (
        <div key={skill} className="space-y-2">
          <Label htmlFor={`${prefix}-${skill}`} className="capitalize">
            {skill}
          </Label>
          <Input
            id={`${prefix}-${skill}`}
            type="number"
            min={0}
            max={12}
            value={scores[skill]}
            onChange={(e) => onChange(skill, parseInt(e.target.value) || 0)}
          />
        </div>
      ))}
    </div>
  );
}

export default function CRSCalculatorPage() {
  const {
    input,
    result,
    loading,
    error,
    step,
    totalSteps,
    updateInput,
    nextStep,
    prevStep,
    calculate,
    reset,
  } = useCRSCalculator();

  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Calculator className="h-8 w-8 text-primary" />
          CRS Calculator
        </h1>
        <p className="text-muted-foreground mt-2">
          Estimate your Comprehensive Ranking System score for Express Entry.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {step + 1} of {totalSteps}: {STEP_LABELS[step]}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEP_LABELS[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "Enter your personal information."}
            {step === 1 && "Provide your education details."}
            {step === 2 && "Enter your language test scores (CLB level)."}
            {step === 3 && "Provide your work experience details."}
            {step === 4 && "Additional factors that may affect your score."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={18}
                  max={65}
                  value={input.age}
                  onChange={(e) =>
                    updateInput({ age: parseInt(e.target.value) || 18 })
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="has_spouse"
                  type="checkbox"
                  checked={input.has_spouse}
                  onChange={(e) =>
                    updateInput({ has_spouse: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="has_spouse">
                  Do you have a spouse or common-law partner?
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="has_sibling"
                  type="checkbox"
                  checked={input.has_sibling_in_canada}
                  onChange={(e) =>
                    updateInput({ has_sibling_in_canada: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="has_sibling">
                  Do you have a sibling who is a citizen or permanent resident of
                  Canada?
                </Label>
              </div>
            </>
          )}

          {/* Step 1: Education */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Education Level</Label>
                <Select
                  value={input.education_level}
                  onValueChange={(v) => updateInput({ education_level: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="can_edu">
                  Years of Post-Secondary Education in Canada
                </Label>
                <Input
                  id="can_edu"
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
              <div className="flex items-center gap-3">
                <input
                  id="cert_qual"
                  type="checkbox"
                  checked={input.has_certificate_of_qualification}
                  onChange={(e) =>
                    updateInput({
                      has_certificate_of_qualification: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="cert_qual">
                  Certificate of qualification from a Canadian province or territory
                </Label>
              </div>
              {input.has_spouse && (
                <div className="space-y-2">
                  <Label>Spouse Education Level</Label>
                  <Select
                    value={input.spouse_education_level || "none"}
                    onValueChange={(v) =>
                      updateInput({
                        spouse_education_level: v === "none" ? null : v,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select spouse education" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {/* Step 2: Language */}
          {step === 2 && (
            <>
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  First Official Language (CLB Scores)
                </Label>
                <LanguageScoreInputs
                  prefix="first"
                  scores={input.first_language}
                  onChange={(field, value) =>
                    updateInput({
                      first_language: {
                        ...input.first_language,
                        [field]: value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Second Official Language (CLB Scores, optional)
                </Label>
                <LanguageScoreInputs
                  prefix="second"
                  scores={
                    input.second_language || {
                      speaking: 0,
                      listening: 0,
                      reading: 0,
                      writing: 0,
                    }
                  }
                  onChange={(field, value) =>
                    updateInput({
                      second_language: {
                        ...(input.second_language || {
                          speaking: 0,
                          listening: 0,
                          reading: 0,
                          writing: 0,
                        }),
                        [field]: value,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="french_clb7"
                  type="checkbox"
                  checked={input.french_clb7_plus}
                  onChange={(e) =>
                    updateInput({ french_clb7_plus: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="french_clb7">French CLB 7+</Label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="english_clb5"
                  type="checkbox"
                  checked={input.english_clb5_plus}
                  onChange={(e) =>
                    updateInput({ english_clb5_plus: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="english_clb5">English CLB 5+</Label>
              </div>
            </>
          )}

          {/* Step 3: Work Experience */}
          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="can_work">
                  Canadian Work Experience (years)
                </Label>
                <Input
                  id="can_work"
                  type="number"
                  min={0}
                  max={10}
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
                  max={10}
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
                    max={10}
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
            </>
          )}

          {/* Step 4: Additional Factors */}
          {step === 4 && (
            <>
              <div className="flex items-center gap-3">
                <input
                  id="prov_nom"
                  type="checkbox"
                  checked={input.has_provincial_nomination}
                  onChange={(e) =>
                    updateInput({
                      has_provincial_nomination: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="prov_nom">Provincial Nomination</Label>
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
                    <SelectValue placeholder="Select NOC level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No job offer</SelectItem>
                    <SelectItem value="00">NOC 00 (Senior management)</SelectItem>
                    <SelectItem value="0ab">NOC 0, A, or B</SelectItem>
                    <SelectItem value="other">Other NOC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {step < totalSteps - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={calculate} disabled={loading}>
              {loading ? "Calculating..." : "Calculate Score"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && !result && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your CRS Score</span>
              <span className="text-4xl font-bold text-primary">
                {result.total_score}
              </span>
            </CardTitle>
            <CardDescription>
              Out of a maximum of {result.max_score} points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress
                value={(result.total_score / result.max_score) * 100}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">
                    Core / Human Capital
                  </p>
                  <p className="text-xl font-semibold">
                    {result.breakdown.core_human_capital}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">
                    Spouse Factors
                  </p>
                  <p className="text-xl font-semibold">
                    {result.breakdown.spouse_factors}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">
                    Skill Transferability
                  </p>
                  <p className="text-xl font-semibold">
                    {result.breakdown.skill_transferability}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">
                    Additional Points
                  </p>
                  <p className="text-xl font-semibold">
                    {result.breakdown.additional_points}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={reset} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
