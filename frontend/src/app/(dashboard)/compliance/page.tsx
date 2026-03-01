"use client";

import { useRouter } from "next/navigation";
import { BookOpen, ClipboardList, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const complianceCards = [
  {
    title: "Employment Standards",
    description:
      "Browse employment standards by province. View rules on wages, hours, leave, and more.",
    icon: BookOpen,
    href: "/compliance/standards",
  },
  {
    title: "Compliance Checklist",
    description:
      "Generate jurisdiction-specific compliance checklists for your business operations.",
    icon: ClipboardList,
    href: "/compliance/checklist",
  },
];

export default function CompliancePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance</h1>
        <p className="text-muted-foreground mt-2">
          Stay on top of Canadian employment standards and regulatory
          requirements.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {complianceCards.map((card) => {
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
