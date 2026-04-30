"use client";

import Link from "next/link";
import { Scale, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Scale className="h-5 w-5 text-primary" />
          <span className="text-lg">LegalAI Studio</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
