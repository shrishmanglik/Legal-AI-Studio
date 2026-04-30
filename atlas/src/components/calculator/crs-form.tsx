"use client";

import React from "react";
import { CRSInput, LanguageScores } from "@/types/immigration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { educationLevels } from "@/lib/validations/calculator";
import {
  ChevronRight,
  ChevronLeft,
  Calculator,
  User,
  GraduationCap,
  Languages,
  Briefcase,
  Star,
} from "lucide-react";

interface CRSFormProps {
  input: CRSInput;
  currentStep: number;
  totalSteps: number;
  isCalculating: boolean;
  onUpdateInput: (updates: Partial<CRSInput>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCalculate: () => void;
}

function LanguageInput({
  label,
  scores,
  onChange,
}: {
  label: string;
  scores: LanguageScores;
  onChange: (scores: LanguageScores) => void;
}) {
  const skills = ["speaking", "listening", "reading", "writing"] as const;

  return (
    <div className="space-y-3">
      <Label className="text-mobile-base font-semibold">{label}</Label>
      <div className="grid grid-cols-2 gap-3">
        {skills.map((skill) => (
          <div key={skill} className="space-y-1.5">
            <Label className="text-mobile-xs capitalize text-muted-foreground">
              {skill}
            </Label>
            <Select
              value={String(scores[skill])}
              onValueChange={(val) =>
                onChange({ ...scores, [skill]: Number(val) })
              }
            >
              <SelectTrigger className="min-h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 13 }, (_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    CLB {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 1: Personal Information ── */
function Step1Personal({
  input,
  onUpdate,
}: {
  input: CRSInput;
  onUpdate: (updates: Partial<CRSInput>) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="age" className="text-mobile-base">
          Age
        </Label>
        <Input
          id="age"
          type="number"
          min={17}
          max={45}
          value={input.age}
          onChange={(e) => onUpdate({ age: Number(e.target.value) })}
          placeholder="Enter your age"
          className="min-h-12"
        />
        <p className="text-mobile-xs text-muted-foreground">
          Must be between 17 and 45
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-mobile-base">
          Do you have a spouse or common-law partner?
        </Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={input.has_spouse ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ has_spouse: true })}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={!input.has_spouse ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ has_spouse: false })}
          >
            No
          </Button>
        </div>
      </div>

      {input.has_spouse && (
        <>
          <div className="space-y-2">
            <Label className="text-mobile-base">
              Spouse&apos;s Education Level
            </Label>
            <Select
              value={input.spouse_education_level || ""}
              onValueChange={(val) =>
                onUpdate({ spouse_education_level: val })
              }
            >
              <SelectTrigger className="min-h-12">
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <LanguageInput
            label="Spouse's Language Scores (CLB)"
            scores={
              input.spouse_language || {
                speaking: 0,
                listening: 0,
                reading: 0,
                writing: 0,
              }
            }
            onChange={(scores) => onUpdate({ spouse_language: scores })}
          />

          <div className="space-y-2">
            <Label className="text-mobile-base">
              Spouse&apos;s Canadian Work Experience
            </Label>
            <Select
              value={String(input.spouse_canadian_experience_years || 0)}
              onValueChange={(val) =>
                onUpdate({ spouse_canadian_experience_years: Number(val) })
              }
            >
              <SelectTrigger className="min-h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {i === 0 ? "None" : `${i} year${i > 1 ? "s" : ""}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Step 2: Education ── */
function Step2Education({
  input,
  onUpdate,
}: {
  input: CRSInput;
  onUpdate: (updates: Partial<CRSInput>) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-mobile-base">Highest Level of Education</Label>
        <Select
          value={input.education_level}
          onValueChange={(val) => onUpdate({ education_level: val })}
        >
          <SelectTrigger className="min-h-12">
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent>
            {educationLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-mobile-xs text-muted-foreground">
          Select the highest level of education you have completed
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-mobile-base">
          Did you complete post-secondary education in Canada?
        </Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={input.canadian_education ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ canadian_education: true })}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={!input.canadian_education ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ canadian_education: false })}
          >
            No
          </Button>
        </div>
        <p className="text-mobile-xs text-muted-foreground">
          Canadian education credentials can earn additional CRS points
        </p>
      </div>

      {input.canadian_education && (
        <div className="space-y-2">
          <Label className="text-mobile-base">
            Canadian Education Credential
          </Label>
          <Select
            value={input.canadian_education_level || ""}
            onValueChange={(val) =>
              onUpdate({ canadian_education_level: val })
            }
          >
            <SelectTrigger className="min-h-12">
              <SelectValue placeholder="Select credential type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one_or_two_year">
                1- or 2-year diploma/certificate
              </SelectItem>
              <SelectItem value="three_year_or_more">
                3-year+ degree, diploma, or certificate
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-mobile-base">
          Do you have a Canadian certificate of qualification in a trade?
        </Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={input.certificate_of_qualification ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ certificate_of_qualification: true })}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={!input.certificate_of_qualification ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ certificate_of_qualification: false })}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Step 3: Language Skills ── */
function Step3Language({
  input,
  onUpdate,
}: {
  input: CRSInput;
  onUpdate: (updates: Partial<CRSInput>) => void;
}) {
  return (
    <div className="space-y-6">
      <LanguageInput
        label="First Official Language (CLB)"
        scores={input.first_language}
        onChange={(scores) => onUpdate({ first_language: scores })}
      />

      <div className="border-t border-border pt-4">
        <LanguageInput
          label="Second Official Language (CLB, optional)"
          scores={
            input.second_language || {
              speaking: 0,
              listening: 0,
              reading: 0,
              writing: 0,
            }
          }
          onChange={(scores) => onUpdate({ second_language: scores })}
        />
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <Label className="text-mobile-base">
          Do you have strong French language skills (CLB 7+)?
        </Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={input.french_proficiency ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ french_proficiency: true })}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={!input.french_proficiency ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ french_proficiency: false })}
          >
            No
          </Button>
        </div>
        <p className="text-mobile-xs text-muted-foreground">
          Strong French skills with English (CLB 5+) earn bonus points
        </p>
      </div>
    </div>
  );
}

/* ── Step 4: Work Experience ── */
function Step4Work({
  input,
  onUpdate,
}: {
  input: CRSInput;
  onUpdate: (updates: Partial<CRSInput>) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-mobile-base">Canadian Work Experience</Label>
        <Select
          value={String(input.canadian_experience_years)}
          onValueChange={(val) =>
            onUpdate({ canadian_experience_years: Number(val) })
          }
        >
          <SelectTrigger className="min-h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 11 }, (_, i) => (
              <SelectItem key={i} value={String(i)}>
                {i === 0 ? "None" : `${i} year${i > 1 ? "s" : ""}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-mobile-xs text-muted-foreground">
          Years of skilled work experience in Canada (NOC 0, A, or B)
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-mobile-base">Foreign Work Experience</Label>
        <Select
          value={String(input.foreign_experience_years)}
          onValueChange={(val) =>
            onUpdate({ foreign_experience_years: Number(val) })
          }
        >
          <SelectTrigger className="min-h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 11 }, (_, i) => (
              <SelectItem key={i} value={String(i)}>
                {i === 0 ? "None" : `${i} year${i > 1 ? "s" : ""}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-mobile-xs text-muted-foreground">
          Years of skilled work experience outside Canada
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-mobile-base">
          Do you have a valid job offer from a Canadian employer?
        </Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={input.job_offer ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ job_offer: true })}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={!input.job_offer ? "default" : "outline"}
            size="lg"
            className="flex-1 min-h-12"
            onClick={() => onUpdate({ job_offer: false })}
          >
            No
          </Button>
        </div>
        <p className="text-mobile-xs text-muted-foreground">
          A valid LMIA-backed job offer can add 50 or 200 points
        </p>
      </div>

      {input.job_offer && (
        <div className="space-y-2">
          <Label className="text-mobile-base">Job Offer NOC Level</Label>
          <Select
            value={input.job_offer_noc_level || ""}
            onValueChange={(val) => onUpdate({ job_offer_noc_level: val })}
          >
            <SelectTrigger className="min-h-12">
              <SelectValue placeholder="Select NOC level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="noc_00">
                NOC 00 - Senior management (+200)
              </SelectItem>
              <SelectItem value="noc_0ab">
                NOC 0, A, B - Skilled (+50)
              </SelectItem>
              <SelectItem value="noc_cd">
                NOC C, D - Semi/low-skilled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

/* ── Step 5: Additional Factors ── */
function Step5Additional({
  input,
  onUpdate,
}: {
  input: CRSInput;
  onUpdate: (updates: Partial<CRSInput>) => void;
}) {
  const toggleItems = [
    {
      key: "provincial_nomination" as const,
      label: "Provincial Nomination",
      description: "Have you received a provincial nomination? (+600 points)",
    },
    {
      key: "siblings_in_canada" as const,
      label: "Siblings in Canada",
      description:
        "Do you have a sibling who is a citizen or permanent resident of Canada? (+15 points)",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-mobile-sm text-muted-foreground">
        These additional factors can significantly boost your CRS score.
        Select all that apply.
      </p>

      <div className="space-y-3">
        {toggleItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onUpdate({ [item.key]: !input[item.key] })}
            className={`w-full rounded-xl border p-4 text-left transition-all active:scale-[0.98] min-h-12 ${
              input[item.key]
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-mobile-base font-medium text-foreground">
                  {item.label}
                </p>
                <p className="mt-0.5 text-mobile-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <div
                className={`ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  input[item.key]
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              >
                {input[item.key] && (
                  <svg
                    className="h-3.5 w-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Summary review */}
      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <h4 className="text-mobile-base font-semibold text-foreground mb-3">
          Quick Summary
        </h4>
        <div className="space-y-2 text-mobile-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age</span>
            <span className="font-medium text-foreground">{input.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Education</span>
            <span className="font-medium text-foreground capitalize">
              {input.education_level.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">First Language (avg CLB)</span>
            <span className="font-medium text-foreground">
              {Math.round(
                (input.first_language.speaking +
                  input.first_language.listening +
                  input.first_language.reading +
                  input.first_language.writing) /
                  4
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Canadian Experience</span>
            <span className="font-medium text-foreground">
              {input.canadian_experience_years === 0
                ? "None"
                : `${input.canadian_experience_years} yr${input.canadian_experience_years > 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Foreign Experience</span>
            <span className="font-medium text-foreground">
              {input.foreign_experience_years === 0
                ? "None"
                : `${input.foreign_experience_years} yr${input.foreign_experience_years > 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Spouse / Partner</span>
            <span className="font-medium text-foreground">
              {input.has_spouse ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const stepConfig = [
  { title: "Personal Information", icon: User },
  { title: "Education", icon: GraduationCap },
  { title: "Language Skills", icon: Languages },
  { title: "Work Experience", icon: Briefcase },
  { title: "Additional Factors", icon: Star },
];

export function CRSForm({
  input,
  currentStep,
  totalSteps,
  isCalculating,
  onUpdateInput,
  onNextStep,
  onPrevStep,
  onCalculate,
}: CRSFormProps) {
  const progressValue = (currentStep / totalSteps) * 100;
  const StepIcon = stepConfig[currentStep - 1]?.icon ?? User;

  return (
    <div className="space-y-5">
      {/* Progress indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-mobile-sm">
          <span className="font-medium text-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-muted-foreground">
            {stepConfig[currentStep - 1]?.title}
          </span>
        </div>
        <Progress value={progressValue} />

        {/* Step dots */}
        <div className="flex justify-between px-1">
          {stepConfig.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-[10px] leading-tight text-center max-w-[52px] ${
                    isActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StepIcon className="h-5 w-5 text-primary" />
            {stepConfig[currentStep - 1]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <Step1Personal input={input} onUpdate={onUpdateInput} />
          )}
          {currentStep === 2 && (
            <Step2Education input={input} onUpdate={onUpdateInput} />
          )}
          {currentStep === 3 && (
            <Step3Language input={input} onUpdate={onUpdateInput} />
          )}
          {currentStep === 4 && (
            <Step4Work input={input} onUpdate={onUpdateInput} />
          )}
          {currentStep === 5 && (
            <Step5Additional input={input} onUpdate={onUpdateInput} />
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex gap-3 pb-20">
        {currentStep > 1 && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 min-h-12"
            onClick={onPrevStep}
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Back
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button
            type="button"
            size="lg"
            className="flex-1 min-h-12"
            onClick={onNextStep}
          >
            Next
            <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            className="flex-1 min-h-12"
            onClick={onCalculate}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Calculating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculate Score
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
