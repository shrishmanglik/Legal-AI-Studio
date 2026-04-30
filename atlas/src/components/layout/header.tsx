"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  className?: string;
}

export function Header({ showBack = false, title, className }: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center px-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-muted active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="text-mobile-xl font-bold tracking-tight text-foreground">
            ATLAS
          </span>
        </Link>

        {title && (
          <span className="ml-3 text-mobile-base text-muted-foreground">
            {title}
          </span>
        )}
      </div>
    </header>
  );
}
