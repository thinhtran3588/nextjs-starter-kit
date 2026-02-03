"use client";

import { useEffect } from "react";

import { useContainer } from "@/common/hooks/use-container";
import { useThemeStore } from "@/common/hooks/use-theme-store";
import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import type { UserSettings } from "@/modules/settings/domain/types";
import { useUserSettingsStore } from "@/modules/settings/hooks/use-user-settings-store";
import type { LoadUserSettingsUseCase } from "@/modules/settings/use-cases/load-user-settings-use-case";

function applyLoadedTheme(settings: UserSettings): void {
  const theme = settings.theme;
  if (theme === "light" || theme === "dark" || theme === "system") {
    useThemeStore.getState().setTheme(theme);
  }
}

export function useSyncUserSettings(): void {
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const setSettings = useUserSettingsStore((s) => s.setSettings);

  useEffect(() => {
    const useCase = container.resolve(
      "loadUserSettingsUseCase",
    ) as LoadUserSettingsUseCase;
    useCase.execute({ userId: user?.id ?? null }).then((loaded) => {
      setSettings(loaded);
      applyLoadedTheme(loaded);
    });
  }, [container, user?.id, setSettings]);
}
