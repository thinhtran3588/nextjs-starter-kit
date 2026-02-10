import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSyncUserSettings } from "@/modules/settings/presentation/hooks/use-sync-user-settings";
import { useUserSettingsStore } from "@/modules/settings/presentation/hooks/use-user-settings-store";

let mockResolve: (key: string) => unknown;
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));

function SyncConsumer() {
  useSyncUserSettings();
  return null;
}

describe("useSyncUserSettings", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: {} });
    vi.clearAllMocks();
    mockResolve = vi.fn();
  });

  it("does not update store when use case returns success false", async () => {
    useUserSettingsStore.setState({ settings: { locale: "en" } });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () =>
            Promise.resolve({ success: false, error: "unavailable" }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual({
        locale: "en",
      });
    });
  });

  it("loads settings and updates store when use case resolves", async () => {
    const settings = { locale: "vi", theme: "dark" };
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () => Promise.resolve({ success: true, data: settings }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual(settings);
    });
  });

  it("calls load with null userId", async () => {
    const execute = vi.fn().mockResolvedValue({ success: true, data: null });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(execute).toHaveBeenCalledWith({ userId: null });
    });
  });

  it("updates store with theme when remote settings include theme", async () => {
    const settings = { locale: "en", theme: "dark" as const };
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () => Promise.resolve({ success: true, data: settings }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual(settings);
    });
  });

  it("updates store with local only when remote is null", async () => {
    useUserSettingsStore.setState({ settings: { locale: "en" } });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () => Promise.resolve({ success: true, data: null }),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual({
        locale: "en",
      });
    });
  });
  it("does not call execute again on re-render", async () => {
    const execute = vi.fn().mockResolvedValue({ success: true, data: null });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    const { rerender } = render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(execute).toHaveBeenCalledTimes(1);
    });

    // Re-render
    rerender(<SyncConsumer />);

    expect(execute).toHaveBeenCalledTimes(1);
  });
});
