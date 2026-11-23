import type { EntryGenerator } from "./$types";

const VARIANTS = [
  "analytics",
  "commerce",
  "finance",
  "operations",
  "saas",
  "learning",
  "booking",
  "health",
  "visual",
  "default",
];

export const entries: EntryGenerator = () =>
  VARIANTS.map((variant) => ({ variant, inside: `${variant}-titles-inside` }));
