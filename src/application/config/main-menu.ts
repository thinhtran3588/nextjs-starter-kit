import type { MenuItem } from "@/common/interfaces/menu-item";

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

export function getMainMenuConfig(): MenuItem[] {
  return [
    {
      id: "home",
      translationKey: "navigation.home",
      href: "/",
    },
    {
      id: "app",
      translationKey: "navigation.app",
      href: "/app/books",
    },
    {
      id: "documents",
      translationKey: "navigation.documents",
      href: "",
      children: DOC_SLUGS.map((slug) => ({
        id: slug,
        translationKey: `navigation.docs.${DOC_I18N_KEYS[slug]}`,
        href: `/docs/${slug}`,
      })),
    },
  ];
}
