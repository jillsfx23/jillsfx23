// The three portfolio categories. `slug` is used in URLs and stored in the
// database; `name` is what clients see. Do not rename the names.
export const CATEGORIES = [
  {
    slug: "graphic-design",
    index: "1",
    name: "GRAPHIC DESIGN",
    blurb: "Posters, logos, branding, social media and advertising work.",
    meta: "Posters · Logos · Branding",
  },
  {
    slug: "3d-design",
    index: "2",
    name: "3D DESIGN",
    blurb: "Models, characters, renders and animation built in Maya.",
    meta: "Models · Renders · Animation",
  },
  {
    slug: "videos",
    index: "3",
    name: "VIDEOS",
    blurb: "Editing, VFX, compositing, motion graphics and showreels.",
    meta: "Editing · VFX · Showreels",
  },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}
