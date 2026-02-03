"use client";

import { useCallback } from "react";

import { useContainer } from "@/common/hooks/use-container";
import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import type { UserSettings } from "@/modules/settings/domain/types";
import { useUserSettingsStore } from "@/modules/settings/hooks/use-user-settings-store";
import type { SaveUserSettingsUseCase } from "@/modules/settings/use-cases/save-user-settings-use-case";

export function usePersistUserSettings(): {
  persistLocale: (locale: string) => void;
  persistTheme: (theme: UserSettings["theme"]) => void;
} {
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const settings = useUserSettingsStore((s) => s.settings);
  const setSettings = useUserSettingsStore((s) => s.setSettings);

  const persistLocale = useCallback(
    (locale: string) => {
      const next = { ...settings, locale };
      setSettings(next);
      const useCase = container.resolve(
        "saveUserSettingsUseCase",
      ) as SaveUserSettingsUseCase;
      useCase.execute({ userId: user?.id ?? null, settings: next });
    },
    [container, user?.id, settings, setSettings],
  );

  const persistTheme = useCallback(
    (theme: UserSettings["theme"]) => {
      if (theme === undefined) return;
      const next = { ...settings, theme };
      setSettings(next);
      const useCase = container.resolve(
        "saveUserSettingsUseCase",
      ) as SaveUserSettingsUseCase;
      useCase.execute({ userId: user?.id ?? null, settings: next });
    },
    [container, user?.id, settings, setSettings],
  );

  return { persistLocale, persistTheme };
}
