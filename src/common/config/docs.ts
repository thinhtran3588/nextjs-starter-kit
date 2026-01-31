export const DOC_SLUGS = [
  "architecture",
  "development-guide",
  "testing-guide",
] as const;

export type DocSlug = (typeof DOC_SLUGS)[number];

export const DOC_I18N_KEYS: Record<DocSlug, string> = {
  architecture: "architecture",
  "development-guide": "developmentGuide",
  "testing-guide": "testingGuide",
};

export function isDocSlug(slug: string): slug is DocSlug {
  return (DOC_SLUGS as readonly string[]).includes(slug);
}
