import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const translations: Record<string, Record<string, string>> = {
  common: {
    "navigation.home": "Home",
    "navigation.signIn": "Sign in",
    "navigation.privacy": "Privacy",
    "navigation.terms": "Terms",
    "navigation.menu": "Menu",
    "language.label": "Language",
    "language.options.en": "English",
    "language.options.vi": "Vietnamese",
    "language.options.zh": "Chinese",
    "language.flags.en": "US",
    "language.flags.vi": "VN",
    "language.flags.zh": "CN",
  },
  "modules.landing.pages.home": {
    badge: "Liquid Badge",
  },
};

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn().mockResolvedValue("en"),
  getTranslations: vi.fn((namespace: string) =>
    Promise.resolve((key: string) => translations[namespace]?.[key] ?? key),
  ),
}));

describe("MarketingLayout", () => {
  it("renders the layout shell and children", async () => {
    const { MarketingLayout } =
      await import("@/common/components/layout/marketing-layout");

    render(await MarketingLayout({ children: <div>Content</div> }));

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(
      screen.getByText(translations["modules.landing.pages.home"].badge),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations.common["language.options.en"]),
    ).toBeInTheDocument();
  });
});
