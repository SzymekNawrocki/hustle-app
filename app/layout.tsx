import type { Metadata } from "next";
import { Exo_2, Geist } from "next/font/google";
import "./globals.css";

const exo2 = Exo_2({
  subsets: ["latin", "latin-ext"],
  variable: "--font-exo2",
});

export const metadata: Metadata = {
  title: "HustleOS",
  description: "Zbuduj swój system sukcesu",
};

import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" data-theme="luxury" className={cn(exo2.variable, "font-sans", geist.variable)}>
      <body
        className="font-sans antialiased"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
