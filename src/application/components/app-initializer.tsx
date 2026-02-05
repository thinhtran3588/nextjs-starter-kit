"use client";

import { initializeContainer } from "@/application/register-container";
import { getContainerOrNull } from "@/common/utils/container";
import { useSyncAuthState } from "@/modules/auth/hooks/use-sync-auth-state";
import { useSyncUserSettings } from "@/modules/settings/hooks/use-sync-user-settings";

export function AppInitializer() {
  if (getContainerOrNull() === null) {
    initializeContainer();
  }

  useSyncAuthState();
  useSyncUserSettings();
  return null;
}
