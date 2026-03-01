"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface MobileNavProps {
  navItems: NavItem[];
  onLogout: () => void;
}

export function MobileNav({ navItems, onLogout }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close menu on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile menu overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-72 border-l bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                <span className="text-primary">LegalAI</span> Studio
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent",
                      isActive
                        ? "bg-accent text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t pt-4">
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive transition-colors hover:bg-accent"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
