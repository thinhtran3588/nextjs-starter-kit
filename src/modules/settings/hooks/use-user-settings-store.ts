"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserSettings } from "@/modules/settings/domain/types";

type UserSettingsState = {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
};

const STORAGE_KEY = "user-settings";

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set) => ({
      settings: {},
      setSettings: (settings) => set({ settings }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);
