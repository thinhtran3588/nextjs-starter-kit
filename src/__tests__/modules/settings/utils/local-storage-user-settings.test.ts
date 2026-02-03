import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LocalStorageUserSettings } from "@/modules/settings/utils/local-storage-user-settings";

describe("LocalStorageUserSettings", () => {
  let storage: LocalStorageUserSettings;
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    mockStorage = {};
    vi.stubGlobal("localStorage", {
      getItem: vi.fn((key: string) => mockStorage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
    });
    vi.stubGlobal("window", { localStorage: globalThis.localStorage });
    storage = new LocalStorageUserSettings();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("get returns empty object when nothing stored", () => {
    expect(storage.get()).toEqual({});
  });

  it("get returns parsed settings when valid JSON stored", () => {
    mockStorage["user-settings"] = JSON.stringify({
      locale: "vi",
      theme: "dark",
    });
    expect(storage.get()).toEqual({ locale: "vi", theme: "dark" });
  });

  it("get returns empty object when stored value is invalid JSON", () => {
    mockStorage["user-settings"] = "not-json";
    expect(storage.get()).toEqual({});
  });

  it("get returns only valid theme values", () => {
    mockStorage["user-settings"] = JSON.stringify({
      locale: "en",
      theme: "invalid",
    });
    expect(storage.get()).toEqual({ locale: "en" });
  });

  it("get returns undefined locale when stored locale is not a string", () => {
    mockStorage["user-settings"] = JSON.stringify({
      locale: 123,
      theme: "light",
    });
    expect(storage.get()).toEqual({ theme: "light" });
  });

  it("get returns empty object when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(storage.get()).toEqual({});
    vi.stubGlobal("window", { localStorage: globalThis.localStorage });
  });

  it("set does nothing when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    storage.set({ locale: "en" });
    expect(mockStorage["user-settings"]).toBeUndefined();
    vi.stubGlobal("window", { localStorage: globalThis.localStorage });
  });

  it("set persists settings to localStorage", () => {
    storage.set({ locale: "en", theme: "light" });
    expect(mockStorage["user-settings"]).toBe(
      JSON.stringify({ locale: "en", theme: "light" }),
    );
  });

  it("set then get round-trips", () => {
    storage.set({ locale: "zh", theme: "system" });
    expect(storage.get()).toEqual({ locale: "zh", theme: "system" });
  });
});
