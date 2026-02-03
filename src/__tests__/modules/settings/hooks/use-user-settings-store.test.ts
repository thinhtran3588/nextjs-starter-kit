import { describe, expect, it } from "vitest";

import { useUserSettingsStore } from "@/modules/settings/hooks/use-user-settings-store";

describe("useUserSettingsStore", () => {
  it("has initial empty settings", () => {
    expect(useUserSettingsStore.getState().settings).toEqual({});
  });

  it("setSettings updates settings", () => {
    useUserSettingsStore.getState().setSettings({
      locale: "en",
      theme: "dark",
    });
    expect(useUserSettingsStore.getState().settings).toEqual({
      locale: "en",
      theme: "dark",
    });
    useUserSettingsStore.getState().setSettings({});
    expect(useUserSettingsStore.getState().settings).toEqual({});
  });
});
