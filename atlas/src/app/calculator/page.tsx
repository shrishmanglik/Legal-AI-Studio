"use client";

import React from "react";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { CRSForm } from "@/components/calculator/crs-form";
import { CRSResultDisplay } from "@/components/calculator/crs-result";
import { useCRSCalculator } from "@/lib/hooks/use-crs-calculator";

export default function CalculatorPage() {
  const {
    input,
    result,
    isCalculating,
    error,
    currentStep,
    totalSteps,
    updateInput,
    nextStep,
    prevStep,
    calculate,
    reset,
  } = useCRSCalculator();

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack title="CRS Calculator" />

      <main className="flex-1 px-4 py-5">
        <div className="mx-auto max-w-lg">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-mobile-sm text-destructive">
              {error}
            </div>
          )}

          {result ? (
            <CRSResultDisplay result={result} onReset={reset} />
          ) : (
            <CRSForm
              input={input}
              currentStep={currentStep}
              totalSteps={totalSteps}
              isCalculating={isCalculating}
              onUpdateInput={updateInput}
              onNextStep={nextStep}
              onPrevStep={prevStep}
              onCalculate={calculate}
            />
          )}
        </div>
      </main>

      <Footer className="pb-20" />
      <MobileNav />
    </div>
  );
}
