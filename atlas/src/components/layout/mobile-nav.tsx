"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Compass, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  {
    label: "Calculator",
    href: "/calculator",
    icon: Calculator,
  },
  {
    label: "Pathways",
    href: "/pathways",
    icon: Compass,
  },
  {
    label: "Checklist",
    href: "/checklist",
    icon: ClipboardCheck,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-mobile-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 h-0.5 w-12 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
