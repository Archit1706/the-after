import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The After — a gentle guide through what comes after",
    short_name: "The After",
    description:
      "A gentle guide for the practical tasks that follow a loss, one calm step at a time.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6f0",
    theme_color: "#faf6f0",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
