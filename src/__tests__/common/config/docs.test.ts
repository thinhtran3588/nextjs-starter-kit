import { describe, expect, it } from "vitest";
import { DOC_SLUGS, DOC_I18N_KEYS } from "@/application/config/main-menu";

describe("docs config", () => {
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
});
