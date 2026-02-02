"use client";

import { useSyncAuthState } from "@/modules/auth/hooks/use-sync-auth-state";

export function SyncAuthState() {
  useSyncAuthState();
  return null;
}
