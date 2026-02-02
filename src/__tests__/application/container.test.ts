import { beforeEach, describe, expect, it, vi } from "vitest";
import { getContainer, getContainerOrNull } from "@/common/utils/container";
import { initializeContainer } from "@/application/register-container";

describe("container", () => {
  beforeEach(() => {
    initializeContainer();
  });

  it("getContainer throws when container not initialized", async () => {
    vi.resetModules();
    const mod = await import("@/common/utils/container");
    expect(() => mod.getContainer()).toThrow("Container not initialized");
  });

  it("getContainerOrNull returns null when container not initialized", async () => {
    vi.resetModules();
    const mod = await import("@/common/utils/container");
    expect(mod.getContainerOrNull()).toBeNull();
  });

  it("setContainer and getContainerOrNull return the set container", async () => {
    vi.resetModules();
    const mod = await import("@/common/utils/container");
    const c = mod.createContainer();
    mod.setContainer(c);
    expect(mod.getContainerOrNull()).toBe(c);
  });

  it("getContainerOrNull returns container after initializeContainer", () => {
    expect(getContainerOrNull()).not.toBeNull();
  });

  it("returns a container that resolves authService", () => {
    const container = getContainer();
    const authService = container.resolve("authService") as {
      signInWithGoogle: () => unknown;
      signOut: () => unknown;
      subscribeToAuthState: (cb: (u: unknown) => void) => () => void;
    };
    expect(authService).toBeDefined();
    expect(typeof authService.signInWithGoogle).toBe("function");
    expect(typeof authService.signOut).toBe("function");
    expect(typeof authService.subscribeToAuthState).toBe("function");
  });

  it("returns a container that resolves use case instances with execute", () => {
    const container = getContainer();
    const signInWithGoogleUseCase = container.resolve(
      "signInWithGoogleUseCase",
    ) as { execute: () => unknown };
    const signOutUseCase = container.resolve("signOutUseCase") as {
      execute: () => unknown;
    };
    const getAuthStateSubscriptionUseCase = container.resolve(
      "getAuthStateSubscriptionUseCase",
    ) as { execute: () => unknown };
    expect(typeof signInWithGoogleUseCase.execute).toBe("function");
    expect(typeof signOutUseCase.execute).toBe("function");
    expect(typeof getAuthStateSubscriptionUseCase.execute).toBe("function");
  });

  it("returns the same container instance on subsequent calls", () => {
    const a = getContainer();
    const b = getContainer();
    expect(a).toBe(b);
  });

  it("resolved authService is a singleton", () => {
    const container = getContainer();
    const a = container.resolve("authService");
    const b = container.resolve("authService");
    expect(a).toBe(b);
  });

  it("resolved use case instances are singletons", () => {
    const container = getContainer();
    const a = container.resolve("signInWithGoogleUseCase");
    const b = container.resolve("signInWithGoogleUseCase");
    expect(a).toBe(b);
  });
});
