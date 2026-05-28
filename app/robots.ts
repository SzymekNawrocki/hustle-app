import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/legal/", "/login", "/register", "/forgot-password"],
      disallow: ["/dashboard", "/goals", "/finance", "/health", "/career", "/settings"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://hustle-app-theta.vercel.app"}/sitemap.xml`,
  };
}
