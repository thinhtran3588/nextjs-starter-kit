import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getResolvedTheme,
  useThemeStore,
} from "@/common/hooks/use-theme-store";

describe("useThemeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "system" });
    localStorage.clear();
  });

  it("defaults to system theme", () => {
    expect(useThemeStore.getState().theme).toBe("system");
  });

  it("setTheme updates theme", () => {
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().theme).toBe("light");

    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().theme).toBe("dark");

    useThemeStore.getState().setTheme("system");
    expect(useThemeStore.getState().theme).toBe("system");
  });
});

describe("getResolvedTheme", () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    useThemeStore.setState({ theme: "system" });
  });

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      value: originalMatchMedia,
      writable: true,
    });
  });

  it("returns light when theme is light", () => {
    expect(getResolvedTheme("light")).toBe("light");
  });

  it("returns dark when theme is dark", () => {
    expect(getResolvedTheme("dark")).toBe("dark");
  });

  it("returns light when theme is system and prefers light", () => {
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn((query: string) => ({
        matches: query === "(prefers-color-scheme: light)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });
    expect(getResolvedTheme("system")).toBe("light");
  });

  it("returns dark when theme is system and prefers dark", () => {
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });
    expect(getResolvedTheme("system")).toBe("dark");
  });

  it("returns dark when window is undefined (SSR)", () => {
    const win = globalThis.window;
    Object.defineProperty(globalThis, "window", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(getResolvedTheme("system")).toBe("dark");
    Object.defineProperty(globalThis, "window", {
      value: win,
      writable: true,
      configurable: true,
    });
  });
});
