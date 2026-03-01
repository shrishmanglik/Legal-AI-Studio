"use client";

import { useState, useCallback } from "react";
import { CRSInput, CRSResult } from "@/types/immigration";
import { calculateCRS, matchPathways } from "@/lib/api/immigration";
import { PathwayMatch } from "@/types/immigration";

interface CRSCalculatorState {
  result: CRSResult | null;
  pathways: PathwayMatch[];
  isCalculating: boolean;
  error: string | null;
  currentStep: number;
  totalSteps: number;
}

const TOTAL_STEPS = 5;

const defaultInput: CRSInput = {
  age: 25,
  education_level: "bachelors",
  first_language: { speaking: 7, listening: 7, reading: 7, writing: 7 },
  second_language: undefined,
  canadian_experience_years: 0,
  has_spouse: false,
  foreign_experience_years: 0,
  certificate_of_qualification: false,
  provincial_nomination: false,
  job_offer: false,
  canadian_education: false,
  siblings_in_canada: false,
  french_proficiency: false,
};

export function useCRSCalculator() {
  const [state, setState] = useState<CRSCalculatorState>({
    result: null,
    pathways: [],
    isCalculating: false,
    error: null,
    currentStep: 1,
    totalSteps: TOTAL_STEPS,
  });

  const [input, setInput] = useState<CRSInput>(defaultInput);

  const updateInput = useCallback((updates: Partial<CRSInput>) => {
    setInput((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, TOTAL_STEPS)),
    }));
  }, []);

  const calculate = useCallback(async () => {
    setState((prev) => ({ ...prev, isCalculating: true, error: null }));

    try {
      const [crsResponse, pathwaysResponse] = await Promise.all([
        calculateCRS(input),
        matchPathways(input),
      ]);

      setState((prev) => ({
        ...prev,
        result: crsResponse.data,
        pathways: pathwaysResponse.data,
        isCalculating: false,
      }));

      return crsResponse.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to calculate CRS score";
      setState((prev) => ({
        ...prev,
        isCalculating: false,
        error: message,
      }));
      throw err;
    }
  }, [input]);

  const reset = useCallback(() => {
    setInput(defaultInput);
    setState({
      result: null,
      pathways: [],
      isCalculating: false,
      error: null,
      currentStep: 1,
      totalSteps: TOTAL_STEPS,
    });
  }, []);

  return {
    ...state,
    input,
    updateInput,
    nextStep,
    prevStep,
    goToStep,
    calculate,
    reset,
  };
}
