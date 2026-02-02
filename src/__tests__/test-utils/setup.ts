import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import messages from "@/application/localization/en.json";
import { getContainerOrNull } from "@/common/utils/container";
import { initializeContainer } from "@/application/register-container";

vi.mock("@/application/config/firebase-config", () => ({
  getAuthInstance: vi.fn(() => null),
}));

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(() => () => {}),
  sendPasswordResetEmail: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

if (getContainerOrNull() === null) {
  initializeContainer();
}

const lookupMessage = (fullKey: string) => {
  const value = fullKey.split(".").reduce<unknown>((result, key) => {
    if (result && typeof result === "object" && key in result) {
      return (result as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);

  return typeof value === "string" ? value : String(value ?? fullKey);
};

vi.mock("next-intl/server", () => ({
  getTranslations: async (namespace?: string) => (key: string) =>
    lookupMessage(namespace ? `${namespace}.${key}` : key),
  getMessages: async () => messages,
  getLocale: async () => "en",
  getRequestConfig: (
    handler: (params: {
      requestLocale: Promise<string | undefined>;
    }) => unknown,
  ) => handler,
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    const t = (key: string) =>
      lookupMessage(namespace ? `${namespace}.${key}` : key);
    t.rich = (key: string) =>
      lookupMessage(namespace ? `${namespace}.${key}` : key);
    return t;
  },
}));

class IntersectionObserverMock implements IntersectionObserver {
  private callback: IntersectionObserverCallback;
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? "0px";
    const threshold = options?.threshold ?? 0;
    this.thresholds = Array.isArray(threshold) ? threshold : [threshold];
  }

  observe(target: Element) {
    const boundingClientRect =
      "getBoundingClientRect" in target
        ? target.getBoundingClientRect()
        : new DOMRect();
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          boundingClientRect,
          intersectionRatio: 1,
          intersectionRect: boundingClientRect,
          rootBounds: null,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      this,
    );
  }

  unobserve() {}

  disconnect() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});
