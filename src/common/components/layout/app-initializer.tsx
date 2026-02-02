"use client";

import { initializeContainer } from "@/application/register-container";
import { getContainerOrNull } from "@/common/utils/container";
import { useSyncAuthState } from "@/modules/auth/hooks/use-sync-auth-state";

export function AppInitializer() {
  if (getContainerOrNull() === null) {
    initializeContainer();
  }

  useSyncAuthState();
  return null;
}
