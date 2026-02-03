import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import { useSyncUserSettings } from "@/modules/settings/hooks/use-sync-user-settings";
import { useUserSettingsStore } from "@/modules/settings/hooks/use-user-settings-store";

let mockResolve: (key: string) => unknown;
const mockSetTheme = vi.fn();
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));
vi.mock("@/common/hooks/use-theme-store", () => ({
  useThemeStore: {
    getState: () => ({ setTheme: mockSetTheme }),
  },
}));

function SyncConsumer() {
  useSyncUserSettings();
  return null;
}

describe("useSyncUserSettings", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: {} });
    useAuthUserStore.setState({ user: null, loading: false });
    mockSetTheme.mockClear();
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

  it("does not load settings from Firestore while auth is still loading", () => {
    useAuthUserStore.setState({ user: null, loading: true });
    const execute = vi.fn().mockResolvedValue({});
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute };
      }
      return undefined;
    };

    render(<SyncConsumer />);

    expect(execute).not.toHaveBeenCalled();
  });

  it("applies loaded theme to theme store when settings include theme", async () => {
    const settings = { locale: "en", theme: "dark" as const };
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
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  it("updates store with local only when remote is null", async () => {
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
    useUserSettingsStore.setState({ settings: { locale: "en" } });
    mockResolve = (key: string) => {
      if (key === "loadUserSettingsUseCase") {
        return { execute: () => Promise.resolve(null) };
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
});
