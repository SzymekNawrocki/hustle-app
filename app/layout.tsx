import type { Metadata } from "next";
import { Exo_2, Geist } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const exo2 = Exo_2({
  subsets: ["latin", "latin-ext"],
  variable: "--font-exo2",
});

export const metadata: Metadata = {
  title: "Hustle App",
  description: "Build your success system",
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
            <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground">
              <span>© {year} </span>
              <span>
                <a
                  href="https://devemite.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Devemite
                </a>
              </span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
