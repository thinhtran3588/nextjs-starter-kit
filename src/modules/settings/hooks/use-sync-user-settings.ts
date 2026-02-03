"use client";

import { useEffect } from "react";

import { useContainer } from "@/common/hooks/use-container";
import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import { useUserSettingsStore } from "@/modules/settings/hooks/use-user-settings-store";
import type { LoadUserSettingsUseCase } from "@/modules/settings/use-cases/load-user-settings-use-case";

export function useSyncUserSettings(): void {
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const setSettings = useUserSettingsStore((s) => s.setSettings);

  useEffect(() => {
    const useCase = container.resolve(
      "loadUserSettingsUseCase",
    ) as LoadUserSettingsUseCase;
    useCase.execute({ userId: user?.id ?? null }).then(setSettings);
  }, [container, user?.id, setSettings]);
}
