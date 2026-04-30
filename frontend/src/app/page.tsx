"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user has a session token
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("legalai_token")
        : null;

    if (token) {
      router.replace("/immigration");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading LegalAI Studio...</p>
      </div>
    </div>
  );
}
