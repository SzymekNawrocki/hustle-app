import type { Metadata } from "next";
import { Exo_2, Geist } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const exo2 = Exo_2({
  subsets: ["latin", "latin-ext"],
  variable: "--font-exo2",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hustle-app-theta.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Hustle App",
    template: "%s | Hustle App",
  },
  description: "Build your success system — track goals, finances, health, and career in one place.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Hustle App",
    title: "Hustle App — Build your success system",
    description: "Track goals, finances, health, and career in one place with AI-powered smart input.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Hustle App dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hustle App — Build your success system",
    description: "Track goals, finances, health, and career in one place.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? "";
  const year = new Date().getFullYear();

  return (
    <html lang="en" nonce={nonce} className={cn(exo2.variable, "font-sans", geist.variable)}>
      <body
        className="font-sans antialiased min-h-dvh flex flex-col"
      >
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <footer className="border-t border-border/60 bg-background/40 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2">
              <span>
                © {year}{" "}
                <a
                  href="https://devemite.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Devemite
                </a>
              </span>
              <a href="/legal/privacy" className="hover:text-foreground underline underline-offset-4">
                Privacy
              </a>
              <a href="/legal/terms" className="hover:text-foreground underline underline-offset-4">
                Terms
              </a>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
