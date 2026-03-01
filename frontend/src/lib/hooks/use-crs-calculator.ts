"use client";

import { useState, useCallback } from "react";
import { calculateCRS } from "@/lib/api/immigration";
import type { CRSInput, CRSResult } from "@/types/immigration";

const DEFAULT_LANGUAGE_SCORES = {
  speaking: 0,
  listening: 0,
  reading: 0,
  writing: 0,
};

const DEFAULT_CRS_INPUT: CRSInput = {
  age: 25,
  has_spouse: false,
  education_level: "bachelors",
  first_language: { ...DEFAULT_LANGUAGE_SCORES },
  second_language: null,
  canadian_work_experience_years: 0,
  foreign_work_experience_years: 0,
  spouse_education_level: null,
  spouse_language: null,
  spouse_canadian_work_years: 0,
  has_certificate_of_qualification: false,
  has_provincial_nomination: false,
  job_offer_noc_level: null,
  canadian_education_years: 0,
  has_sibling_in_canada: false,
  french_clb7_plus: false,
  english_clb5_plus: false,
};

export function useCRSCalculator() {
  const [input, setInput] = useState<CRSInput>(DEFAULT_CRS_INPUT);
  const [result, setResult] = useState<CRSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const totalSteps = 5;

  const updateInput = useCallback(
    (updates: Partial<CRSInput>) => {
      setInput((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, []);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((s: number) => {
    setStep(Math.max(0, Math.min(s, totalSteps - 1)));
  }, []);

  const calculate = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const crsResult = await calculateCRS(input);
      setResult(crsResult);
      return crsResult;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Calculation failed";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [input]);

  const reset = useCallback(() => {
    setInput(DEFAULT_CRS_INPUT);
    setResult(null);
    setError(null);
    setStep(0);
  }, []);

  return {
    input,
    result,
    loading,
    error,
    step,
    totalSteps,
    updateInput,
    nextStep,
    prevStep,
    goToStep,
    calculate,
    reset,
  };
}
