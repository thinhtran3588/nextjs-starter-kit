"use client";

import { initializeContainer } from "@/application/register-container";
import { getContainerOrNull } from "@/common/utils/container";
import { useSyncAnalyticsUser } from "@/modules/analytics/presentation/hooks/use-sync-analytics-user";
import { useSyncUserSettings } from "@/modules/settings/presentation/hooks/use-sync-user-settings";

export function AppInitializer() {
  if (getContainerOrNull() === null) {
    initializeContainer();
  }

  useSyncUserSettings();
  useSyncAnalyticsUser();
  return null;
}
