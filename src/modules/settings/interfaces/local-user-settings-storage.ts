import type { UserSettings } from "@/modules/settings/domain/types";

export interface LocalUserSettingsStorage {
  get(): UserSettings;
  set(settings: UserSettings): void;
}
