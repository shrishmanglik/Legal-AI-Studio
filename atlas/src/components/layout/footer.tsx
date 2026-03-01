import React from "react";
import { cn } from "@/lib/utils/cn";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-secondary px-4 py-6 text-center",
        className
      )}
    >
      <p className="text-mobile-xs text-muted-foreground leading-relaxed">
        ATLAS provides general information about Canadian immigration programs.
        This tool does not constitute legal advice. Always consult a licensed
        immigration consultant or lawyer (RCIC/lawyer) for personalized
        guidance. Information is based on publicly available IRCC data and may
        not reflect the latest policy changes.
      </p>
      <p className="mt-3 text-mobile-xs text-muted-foreground/60">
        &copy; {new Date().getFullYear()} ATLAS Immigration Portal. Not
        affiliated with IRCC.
      </p>
    </footer>
  );
}
