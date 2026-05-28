import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Hustle App",
  description: "How Hustle App collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16 prose prose-invert prose-sm">
        <h1 className="text-3xl font-display text-primary tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: May {year}</p>

        <section className="space-y-4">
          <h2 className="text-xl font-display tracking-tight">1. Who we are</h2>
          <p>
            Hustle App is a personal life-tracking tool built by{" "}
            <a href="https://devemite.vercel.app/" className="text-primary underline" target="_blank" rel="noreferrer">
              Devemite
            </a>
            . &quot;We&quot;, &quot;us&quot;, or &quot;our&quot; refers to the operator of this service.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">2. What data we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account data:</strong> email address and display name provided during registration.</li>
            <li><strong>Content data:</strong> goals, tasks, expenses, meal logs, and career entries you create inside the app.</li>
            <li><strong>Technical data:</strong> IP address (for rate limiting), request metadata logged for security purposes. We do not log JWT tokens or passwords.</li>
          </ul>
          <p>We do not collect payment card data, social logins, or third-party tracking pixels.</p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">3. How we use your data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide and operate the service (store and display your entries).</li>
            <li>To process natural-language input through an AI model (your text is sent to Groq — see Sub-processors below).</li>
            <li>To send transactional emails (password reset) via Resend.</li>
            <li>To monitor errors and performance via Sentry.</li>
          </ul>
          <p>We do not sell your data. We do not use your data for advertising.</p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">4. Sub-processors</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Neon (neon.tech)</strong> — PostgreSQL database hosting. Your data is stored here.</li>
            <li><strong>Render (render.com)</strong> — Backend API hosting.</li>
            <li><strong>Vercel (vercel.com)</strong> — Frontend hosting.</li>
            <li><strong>Groq (groq.com)</strong> — AI inference for natural-language input parsing. Text you submit via smart-create features is processed by Groq.</li>
            <li><strong>Resend (resend.com)</strong> — Transactional email delivery (password reset).</li>
            <li><strong>Sentry (sentry.io)</strong> — Error monitoring. PII scrubbing is enabled.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">5. Data retention</h2>
          <p>
            Your data is retained as long as your account exists. When you delete your account (Settings → Danger zone), all your data is permanently and immediately deleted from our database.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">6. Your rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Access</strong> your data — all your content is visible in the app.</li>
            <li><strong>Correct</strong> your data — edit your entries or update your profile in Settings.</li>
            <li><strong>Delete</strong> your data — use Settings → Danger zone → Delete account, or contact us.</li>
            <li><strong>Export</strong> your data — use the Export feature in the app.</li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">7. Cookies</h2>
          <p>
            We use two HTTP-only cookies (<code>token</code> and <code>frontend_token</code>) solely to maintain your authenticated session. No advertising or analytics cookies are set.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-display tracking-tight">8. Contact</h2>
          <p>
            For privacy questions or data requests email:{" "}
            <a href="mailto:devnawrocki@gmail.com" className="text-primary underline">
              devnawrocki@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
