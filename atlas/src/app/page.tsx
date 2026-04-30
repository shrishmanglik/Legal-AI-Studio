"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import {
  Calculator,
  Compass,
  ClipboardCheck,
  ArrowRight,
  Globe,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "CRS Calculator",
    description:
      "Calculate your Comprehensive Ranking System score with our step-by-step wizard.",
    href: "/calculator",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Compass,
    title: "Pathway Finder",
    description:
      "Discover immigration programs that match your profile and qualifications.",
    href: "/pathways",
    color: "bg-success/10 text-success",
  },
  {
    icon: ClipboardCheck,
    title: "Task Checklist",
    description:
      "Track your post-landing tasks and stay on top of your immigration journey.",
    href: "/checklist",
    color: "bg-warning/10 text-warning",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pb-10 pt-8">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

          <div className="relative mx-auto max-w-lg text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
              <Globe className="h-8 w-8 text-white" />
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              <span className="gradient-text">ATLAS</span>
            </h1>

            <p className="mt-2 text-mobile-xl font-medium text-foreground/90">
              Your Immigration Journey Starts Here
            </p>

            <p className="mt-3 text-mobile-base text-muted-foreground leading-relaxed">
              Get your Comprehensive Ranking System score and discover the best
              immigration pathways for your profile.
            </p>

            <div className="mt-6">
              <Button asChild size="lg" className="w-full text-mobile-lg h-14 shadow-xl shadow-primary/25">
                <Link href="/calculator">
                  Calculate Your CRS Score
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1 text-mobile-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-warning" />
              <span>Free and confidential -- no account required</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 pb-8">
          <div className="mx-auto max-w-lg space-y-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="transition-all hover:border-primary/30 active:scale-[0.98] mb-3">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${feature.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-mobile-base font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="mt-0.5 text-mobile-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 pb-24">
          <div className="mx-auto max-w-lg">
            <Card>
              <CardContent className="grid grid-cols-3 gap-4 p-5">
                <div className="text-center">
                  <p className="text-mobile-2xl font-bold text-primary">80+</p>
                  <p className="mt-0.5 text-mobile-xs text-muted-foreground">
                    Programs
                  </p>
                </div>
                <div className="text-center border-x border-border">
                  <p className="text-mobile-2xl font-bold text-primary">
                    1,200
                  </p>
                  <p className="mt-0.5 text-mobile-xs text-muted-foreground">
                    Max CRS
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-mobile-2xl font-bold text-primary">Free</p>
                  <p className="mt-0.5 text-mobile-xs text-muted-foreground">
                    Always
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer className="pb-20" />
      <MobileNav />
    </div>
  );
}
