"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="border-b bg-yellow-500/10 px-6 py-2">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />
        <p className="flex-1 text-xs text-yellow-200">
          <strong>Disclaimer:</strong> This tool provides AI-generated legal
          information for educational and research purposes only. It does not
          constitute legal advice. Always consult a qualified legal professional
          for specific legal matters.
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => setDismissed(true)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
