import { describe, expect, it } from "vitest";

import {
  DOC_I18N_KEYS,
  DOC_SLUGS,
  getMainMenuConfig,
  type DocSlug,
} from "@/application/config/main-menu";

describe("main-menu", () => {
  it("exports expected doc slugs", () => {
    expect(DOC_SLUGS).toEqual([
      "architecture",
      "development-guide",
      "testing-guide",
    ]);
  });

  it("DOC_I18N_KEYS maps each slug to an i18n key", () => {
    expect(DOC_I18N_KEYS).toEqual({
      architecture: "architecture",
      "development-guide": "developmentGuide",
      "testing-guide": "testingGuide",
    });
  });

  it("getMainMenuConfig returns menu items with home, app, documents, legal (privacy and terms)", () => {
    const menu = getMainMenuConfig();
    expect(menu).toHaveLength(4);
    expect(menu[0]).toEqual({
      id: "home",
      translationKey: "navigation.home",
      href: "/",
    });
    expect(menu[1]).toEqual({
      id: "app",
      translationKey: "navigation.app",
      href: "/app/books",
    });
    expect(menu[2].id).toBe("documents");
    expect(menu[2].translationKey).toBe("navigation.documents");
    expect(menu[2].href).toBe("");
    expect(menu[2].children).toHaveLength(3);
    const docSlugs = menu[2].children!.map((c) => c.id) as DocSlug[];
    expect(docSlugs).toEqual(DOC_SLUGS);
    expect(menu[2].children!.map((c) => c.href)).toEqual([
      "/docs/architecture",
      "/docs/development-guide",
      "/docs/testing-guide",
    ]);
    expect(menu[3].id).toBe("legal");
    expect(menu[3].translationKey).toBe("navigation.legal");
    expect(menu[3].href).toBe("");
    expect(menu[3].children).toHaveLength(2);
    expect(menu[3].children![0]).toEqual({
      id: "privacy",
      translationKey: "navigation.privacy",
      href: "/privacy-policy",
    });
    expect(menu[3].children![1]).toEqual({
      id: "terms",
      translationKey: "navigation.terms",
      href: "/terms-of-service",
    });
  });
});
