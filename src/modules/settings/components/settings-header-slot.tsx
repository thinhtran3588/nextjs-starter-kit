"use client";

import { LanguageSelector } from "@/modules/settings/components/language-selector";
import { ThemeSelector } from "@/modules/settings/components/theme-selector";

export function SettingsHeaderSlot() {
  return (
    <>
      <ThemeSelector />
      <LanguageSelector />
    </>
  );
}
