"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("legalai_token")
        : null;
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <DisclaimerBanner />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
