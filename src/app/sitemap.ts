import type { MetadataRoute } from "next";

const baseUrl = "https://theafter.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${baseUrl}/how-it-helps`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
