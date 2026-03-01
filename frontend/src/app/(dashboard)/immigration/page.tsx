"use client";

import { useRouter } from "next/navigation";
import {
  Calculator,
  GitBranch,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const immigrationCards = [
  {
    title: "CRS Calculator",
    description:
      "Calculate your Comprehensive Ranking System score for Express Entry immigration.",
    icon: Calculator,
    href: "/immigration/calculator",
  },
  {
    title: "Pathway Finder",
    description:
      "Discover immigration pathways that match your profile and qualifications.",
    icon: GitBranch,
    href: "/immigration/pathways",
  },
  {
    title: "Post-Landing Checklist",
    description:
      "Track your post-landing tasks and settlement steps after arriving in Canada.",
    icon: ClipboardCheck,
    href: "/immigration/checklist",
  },
];

export default function ImmigrationPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Immigration</h1>
        <p className="text-muted-foreground mt-2">
          Tools to help you navigate the Canadian immigration process.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {immigrationCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.href}
              className="group cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => router.push(card.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {card.description}
                </CardDescription>
                <Button
                  variant="ghost"
                  className="mt-4 px-0 text-primary group-hover:translate-x-1 transition-transform"
                >
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
