"use client";

import { useSyncUserSettings } from "@/modules/settings/hooks/use-sync-user-settings";

export function SyncUserSettings() {
  useSyncUserSettings();
  return null;
}
