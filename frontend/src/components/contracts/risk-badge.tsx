"use client";

import { cn } from "@/lib/utils/cn";
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

interface RiskBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({ score, size = "md" }: RiskBadgeProps) {
  const level = score < 30 ? "low" : score < 60 ? "medium" : "high";

  const config = {
    low: { label: "Low Risk", color: "text-green-400 bg-green-400/10 border-green-400/30", icon: ShieldCheck },
    medium: { label: "Medium Risk", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", icon: AlertTriangle },
    high: { label: "High Risk", color: "text-red-400 bg-red-400/10 border-red-400/30", icon: ShieldAlert },
  };

  const { label, color, icon: Icon } = config[level];
  const sizeClasses = { sm: "text-xs px-2 py-0.5 gap-1", md: "text-sm px-3 py-1 gap-1.5", lg: "text-base px-4 py-2 gap-2" };
  const iconSizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };

  return (
    <span className={cn("inline-flex items-center rounded-full border font-medium", color, sizeClasses[size])}>
      <Icon className={iconSizes[size]} />
      {label} ({score.toFixed(0)}%)
    </span>
  );
}
