import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/sign-in",
        "/sign-up",
        "/begin",
        "/plan",
        "/plan/tasks/",
        "/letters",
        "/letters/",
        "/documents",
        "/directory",
        "/companion",
        "/settings",
      ],
    },
    sitemap: "https://theafter.vercel.app/sitemap.xml",
  };
}
