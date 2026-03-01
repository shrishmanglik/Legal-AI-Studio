export function Footer() {
  return (
    <footer className="border-t py-4 px-6">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          LegalAI Studio &mdash; AI-Powered Legal Research Platform
        </p>
        <p className="text-xs text-muted-foreground">
          Not a substitute for professional legal advice.
        </p>
      </div>
    </footer>
  );
}
