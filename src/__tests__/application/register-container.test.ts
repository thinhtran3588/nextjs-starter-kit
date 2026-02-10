import { beforeEach, describe, expect, it } from "vitest";

import { initializeContainer } from "@/application/register-container";
import { getContainer, getContainerOrNull } from "@/common/utils/container";

describe("register-container", () => {
  beforeEach(() => {
    initializeContainer();
  });

  it("getContainerOrNull returns container after initializeContainer", () => {
    expect(getContainerOrNull()).not.toBeNull();
  });

  it("returns the same container instance on subsequent calls", () => {
    const a = getContainer();
    const b = getContainer();
    expect(a).toBe(b);
  });

  it("returns a container that resolves settings repository and use cases", () => {
    const container = getContainer();
    const repo = container.resolve("userSettingsRepository") as {
      get: (userId: string) => Promise<unknown>;
      set: (userId: string, settings: unknown) => Promise<void>;
    };
    const loadUseCase = container.resolve("loadUserSettingsUseCase") as {
      execute: (input: { userId: string | null }) => Promise<unknown>;
    };
    const saveUseCase = container.resolve("saveUserSettingsUseCase") as {
      execute: (input: {
        userId: string | null;
        settings: unknown;
      }) => Promise<void>;
    };
    expect(repo).toBeDefined();
    expect(typeof repo.get).toBe("function");
    expect(typeof repo.set).toBe("function");
    expect(typeof loadUseCase.execute).toBe("function");
    expect(typeof saveUseCase.execute).toBe("function");
  });

  it("returns a container that resolves analytics service and use cases", () => {
    const container = getContainer();
    const service = container.resolve("analyticsService") as {
      logEvent: (eventName: string, params?: Record<string, unknown>) => void;
      setUserId: (userId: string | null) => void;
    };
    const logEventUseCase = container.resolve("logEventUseCase") as {
      execute: (input: unknown) => Promise<unknown>;
    };
    const setAnalyticsUserUseCase = container.resolve(
      "setAnalyticsUserUseCase",
    ) as {
      execute: (input: unknown) => Promise<unknown>;
    };
    expect(service).toBeDefined();
    expect(typeof service.logEvent).toBe("function");
    expect(typeof service.setUserId).toBe("function");
    expect(typeof logEventUseCase.execute).toBe("function");
    expect(typeof setAnalyticsUserUseCase.execute).toBe("function");
  });
});
