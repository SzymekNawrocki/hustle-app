import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Hustle App",
  description: "Terms governing your use of Hustle App.",
};

export default function TermsPage() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 prose prose-invert prose-sm">
        <h1 className="text-3xl font-display text-primary tracking-tight mb-2">Terms of Service</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: May {year}</p>

        <section className="space-y-4">
          <h2 className="text-xl font-display tracking-tight">1. Acceptance</h2>
          <p>
            By creating an account or using Hustle App you agree to these terms. If you do not agree, do not use the service.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">2. Description of service</h2>
          <p>
            Hustle App is a personal productivity tool for tracking goals, finances, health, and career. It is provided free of charge as a portfolio and personal-use project. We make no guarantee of uptime or data durability beyond our reasonable efforts.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">3. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the service for any unlawful purpose.</li>
            <li>Attempt to compromise the security or integrity of the service.</li>
            <li>Submit content that is harmful, misleading, or infringes third-party rights.</li>
            <li>Abuse the AI features with spam or excessively large inputs.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">4. Your content</h2>
          <p>
            You own the content you create in Hustle App. By using the service, you grant us a limited licence to store and process that content solely to provide the service to you.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">5. AI-generated suggestions</h2>
          <p>
            The app uses an AI model (Groq / llama-3.3-70b) to parse natural-language input. AI suggestions may be inaccurate. Always verify AI-generated entries before relying on them.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">6. Account termination</h2>
          <p>
            You may delete your account at any time via Settings → Danger zone. We may suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">7. Disclaimer of warranties</h2>
          <p>
            The service is provided &quot;as is&quot; without warranty of any kind. We are not liable for any loss of data, loss of business, or indirect damages arising from your use of the service.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">8. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the service after changes are posted constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">9. Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a href="mailto:devnawrocki@gmail.com" className="text-primary underline">
              devnawrocki@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
