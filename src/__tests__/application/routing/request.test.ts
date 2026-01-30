import { vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getRequestConfig: (
    handler: (params: {
      requestLocale: Promise<string | undefined>;
    }) => Promise<unknown>,
  ) => handler,
}));

describe("request config", () => {
  it("loads messages for the requested locale", async () => {
    const requestConfig = (await import("../../../application/routing/request"))
      .default;
    const messages = (await import("../../../application/localization/en.json"))
      .default;

    const result = await requestConfig({
      requestLocale: Promise.resolve("en"),
    });

    expect(result).toEqual({ locale: "en", messages });
  });

  it("falls back to default locale when unsupported", async () => {
    const requestConfig = (await import("../../../application/routing/request"))
      .default;
    const messages = (await import("../../../application/localization/en.json"))
      .default;

    const result = await requestConfig({
      requestLocale: Promise.resolve("fr"),
    });

    expect(result).toEqual({ locale: "en", messages });
  });
});
