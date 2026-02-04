import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { SettingsHeaderSlot } from "@/modules/settings/components/settings-header-slot";

vi.mock(
  "@/modules/settings/hooks/use-user-settings-store",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/modules/settings/hooks/use-user-settings-store")
      >();
    return {
      ...actual,
      useUserSettings: () => ({
        settings: actual.useUserSettingsStore.getState().settings,
        setSettings: actual.useUserSettingsStore.getState().setSettings,
        persistLocale: vi.fn(),
        persistTheme: vi.fn(),
      }),
    };
  },
);

describe("SettingsHeaderSlot", () => {
  it("renders theme selector and language selector", () => {
    render(<SettingsHeaderSlot />);

    expect(
      screen.getByRole("button", { name: "Theme: System" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Language: English" }),
    ).toBeInTheDocument();
  });
});
