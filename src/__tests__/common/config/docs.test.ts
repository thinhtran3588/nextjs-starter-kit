import { describe, expect, it } from "vitest";
import { DOC_SLUGS, DOC_I18N_KEYS, isDocSlug } from "@/common/config/docs";

describe("docs config", () => {
  it("exports expected doc slugs", () => {
    expect(DOC_SLUGS).toEqual([
      "architecture",
      "development-guide",
      "testing-guide",
    ]);
  });

  it("maps each slug to an i18n key", () => {
    expect(DOC_I18N_KEYS).toEqual({
      architecture: "architecture",
      "development-guide": "developmentGuide",
      "testing-guide": "testingGuide",
    });
  });

  it("isDocSlug returns true for valid slugs", () => {
    expect(isDocSlug("architecture")).toBe(true);
    expect(isDocSlug("development-guide")).toBe(true);
    expect(isDocSlug("testing-guide")).toBe(true);
  });

  it("isDocSlug returns false for invalid slugs", () => {
    expect(isDocSlug("")).toBe(false);
    expect(isDocSlug("unknown")).toBe(false);
    expect(isDocSlug("arch")).toBe(false);
  });
});
