"use client";

import { useEffect, useRef } from "react";

import { useContainer } from "@/common/hooks/use-container";
import type { LoadUserSettingsUseCase } from "@/modules/settings/application/load-user-settings-use-case";
import { useUserSettingsStore } from "@/modules/settings/presentation/hooks/use-user-settings-store";

export function useSyncUserSettings(): void {
  const container = useContainer();
  const setSettings = useUserSettingsStore((s) => s.setSettings);
  const hasCompletedInitialLoad = useRef(false);

  useEffect(() => {
    if (!hasCompletedInitialLoad.current) {
      hasCompletedInitialLoad.current = true;
      const useCase = container.resolve(
        "loadUserSettingsUseCase",
      ) as LoadUserSettingsUseCase;
      const local = useUserSettingsStore.getState().settings;
      useCase.execute({ userId: null }).then((result) => {
        if (!result.success) return;
        const remote = result.data;
        const merged = remote ? { ...local, ...remote } : local;
        setSettings(merged);
      });
    }
  }, [container, setSettings]);
}
