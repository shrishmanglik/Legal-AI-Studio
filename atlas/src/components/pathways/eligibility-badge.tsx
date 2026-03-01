import React from "react";
import { Badge } from "@/components/ui/badge";

interface EligibilityBadgeProps {
  eligibility: "eligible" | "likely" | "unlikely";
}

const config = {
  eligible: {
    label: "Eligible",
    variant: "success" as const,
  },
  likely: {
    label: "Likely Eligible",
    variant: "warning" as const,
  },
  unlikely: {
    label: "Unlikely",
    variant: "destructive" as const,
  },
};

export function EligibilityBadge({ eligibility }: EligibilityBadgeProps) {
  const { label, variant } = config[eligibility];

  return <Badge variant={variant}>{label}</Badge>;
}
