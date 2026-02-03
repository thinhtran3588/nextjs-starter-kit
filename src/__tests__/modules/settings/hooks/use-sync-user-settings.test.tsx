import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import { useSyncUserSettings } from "@/modules/settings/hooks/use-sync-user-settings";
import { useUserSettingsStore } from "@/modules/settings/hooks/use-user-settings-store";

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
    useAuthUserStore.setState({ user: null, loading: false });
    vi.clearAllMocks();
    mockResolve = vi.fn();
  });

  it("loads settings and updates store when use case resolves", async () => {
    const settings = { locale: "vi", theme: "dark" };
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return {
          execute: () => Promise.resolve(settings),
        };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(useUserSettingsStore.getState().settings).toEqual(settings);
    });
  });

  it("calls load with userId when user is signed in", async () => {
    useAuthUserStore.setState({
      user: {
        id: "uid-1",
        email: "a@b.com",
        displayName: "Alice",
        photoURL: null,
        authType: "email",
      },
      loading: false,
    });
    const execute = vi.fn().mockResolvedValue({});
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    await vi.waitFor(() => {
      expect(execute).toHaveBeenCalledWith({ userId: "uid-1" });
    });
  });

  it("calls load with null userId when user is not signed in", async () => {
    const execute = vi.fn().mockResolvedValue({});
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
});
