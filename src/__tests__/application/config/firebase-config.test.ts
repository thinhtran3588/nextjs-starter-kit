import { beforeEach, describe, expect, it, vi } from "vitest";

vi.unmock("@/application/config/firebase-config");
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));
vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(),
}));

describe("firebase-config", () => {
  const originalWindow = globalThis.window;

  beforeEach(async () => {
    vi.resetModules();
    const auth = await import("firebase/auth");
    vi.mocked(auth.getAuth).mockReturnValue({} as never);
  });

  it("getAuthInstance returns null when window is undefined", async () => {
    vi.stubGlobal("window", undefined);
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    expect(getAuthInstance()).toBeNull();
    vi.stubGlobal("window", originalWindow);
  });

  it("getAuthInstance returns auth instance when window is defined", async () => {
    vi.stubGlobal("window", originalWindow);
    const mockAuth = {};
    const auth = await import("firebase/auth");
    vi.mocked(auth.getAuth).mockReturnValue(mockAuth as never);
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    expect(getAuthInstance()).toBe(mockAuth);
  });

  it("getAuthInstance returns same instance on subsequent calls", async () => {
    vi.stubGlobal("window", originalWindow);
    const mockAuth = {};
    const auth = await import("firebase/auth");
    vi.mocked(auth.getAuth).mockReturnValue(mockAuth as never);
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    const first = getAuthInstance();
    const second = getAuthInstance();
    expect(first).toBe(second);
  });
});
