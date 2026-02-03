"use client";

import type { UserSettings } from "@/modules/settings/domain/types";
import type { LocalUserSettingsStorage } from "@/modules/settings/interfaces/local-user-settings-storage";

const STORAGE_KEY = "user-settings";

function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function readRaw(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(STORAGE_KEY);
}

export class LocalStorageUserSettings implements LocalUserSettingsStorage {
  get(): UserSettings {
    const raw = readRaw();
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return {
        locale: typeof parsed.locale === "string" ? parsed.locale : undefined,
        theme:
          parsed.theme === "light" ||
          parsed.theme === "dark" ||
          parsed.theme === "system"
            ? parsed.theme
            : undefined,
      };
    } catch {
      return {};
    }
  }

  set(settings: UserSettings): void {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}
