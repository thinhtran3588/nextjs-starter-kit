"use client";

import { create } from "zustand";

import type { UserSettings } from "@/modules/settings/domain/types";

type UserSettingsState = {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
};

export const useUserSettingsStore = create<UserSettingsState>((set) => ({
  settings: {},
  setSettings: (settings) => set({ settings }),
}));
