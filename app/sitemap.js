import { CATEGORIES } from "@/lib/categories";

// Set NEXT_PUBLIC_SITE_URL to your live domain once deployed.
const base = process.env.NEXT_PUBLIC_SITE_URL || "https://jillseffects.vercel.app";

export default function sitemap() {
  const now = new Date();
  return [
    { url: base, lastModified: now, priority: 1 },
    ...CATEGORIES.map((c) => ({
      url: `${base}/works/${c.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
