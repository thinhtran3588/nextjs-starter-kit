import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.unmock("@/application/config/firebase-config");
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));
vi.mock("firebase/analytics", () => ({
  getAnalytics: vi.fn(),
}));

const validFirebaseConfigJson = JSON.stringify({
  apiKey: "test-api-key",
  authDomain: "test.firebaseapp.com",
  projectId: "test-project",
  storageBucket: "test.firebasestorage.app",
  messagingSenderId: "123",
  appId: "1:123:web:abc",
  measurementId: "G-TEST",
});

describe("firebase-config", () => {
  const originalWindow = globalThis.window;
  const originalEnv = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

  beforeEach(async () => {
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG = validFirebaseConfigJson;
    vi.resetModules();
    const auth = await import("firebase/auth");
    vi.mocked(auth.getAuth).mockReturnValue({} as never);
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_FIREBASE_CONFIG = originalEnv;
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

  it("getAuthInstance returns null when NEXT_PUBLIC_FIREBASE_CONFIG is missing", async () => {
    vi.stubGlobal("window", originalWindow);
    delete process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
    vi.resetModules();
    const { getAuthInstance } =
      await import("@/application/config/firebase-config");
    expect(getAuthInstance()).toBeNull();
  });
});
