import { routing } from "../../../application/routing/routing";

describe("routing", () => {
  it("exposes the default locale", () => {
    expect(routing.defaultLocale).toBe("en");
  });

  it("includes the supported locales", () => {
    expect(routing.locales).toEqual(["en"]);
  });
});
