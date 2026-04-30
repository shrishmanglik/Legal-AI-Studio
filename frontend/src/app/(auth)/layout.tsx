import { Scale } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-3">
        <Scale className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">LegalAI Studio</h1>
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        AI-powered legal research and analysis platform.
        <br />
        Not a substitute for professional legal advice.
      </p>
    </div>
  );
}
