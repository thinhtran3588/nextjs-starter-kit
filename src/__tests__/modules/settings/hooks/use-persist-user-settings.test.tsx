import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import { usePersistUserSettings } from "@/modules/settings/hooks/use-persist-user-settings";
import { useUserSettingsStore } from "@/modules/settings/hooks/use-user-settings-store";

let mockResolve: (key: string) => unknown;
const mockExecute = vi.fn();
vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));

describe("usePersistUserSettings", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: {} });
    useAuthUserStore.setState({ user: null, loading: false });
    mockExecute.mockReset().mockResolvedValue(undefined);
    mockResolve = (key: string) => {
      if (key === "saveUserSettingsUseCase") {
        return { execute: mockExecute };
      }
      return undefined;
    };
  });

  it("persistLocale updates store and calls save use case", async () => {
    const { result } = renderHook(() => usePersistUserSettings());

    await act(async () => {
      result.current.persistLocale("vi");
    });

    expect(useUserSettingsStore.getState().settings.locale).toBe("vi");
    expect(mockExecute).toHaveBeenCalledWith({
      userId: null,
      settings: { locale: "vi" },
    });
  });

  it("persistTheme updates store and calls save use case", async () => {
    const { result } = renderHook(() => usePersistUserSettings());

    await act(async () => {
      result.current.persistTheme("dark");
    });

    expect(useUserSettingsStore.getState().settings.theme).toBe("dark");
    expect(mockExecute).toHaveBeenCalledWith({
      userId: null,
      settings: { theme: "dark" },
    });
  });

  it("persistLocale passes userId when user is signed in", async () => {
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

    const { result } = renderHook(() => usePersistUserSettings());

    await act(async () => {
      result.current.persistLocale("zh");
    });

    expect(mockExecute).toHaveBeenCalledWith({
      userId: "uid-1",
      settings: { locale: "zh" },
    });
  });

  it("persistTheme does nothing when theme is undefined", async () => {
    const { result } = renderHook(() => usePersistUserSettings());

    await act(async () => {
      result.current.persistTheme(undefined);
    });

    expect(mockExecute).not.toHaveBeenCalled();
  });

  it("persistTheme passes userId when user is signed in", async () => {
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

    const { result } = renderHook(() => usePersistUserSettings());

    await act(async () => {
      result.current.persistTheme("light");
    });

    expect(mockExecute).toHaveBeenCalledWith({
      userId: "uid-1",
      settings: { theme: "light" },
    });
  });
});
