import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Theme } from "@/common/utils/theme";
import { ThemeSelector } from "@/modules/settings/components/theme-selector";
import { useUserSettingsStore } from "@/modules/settings/hooks/use-user-settings-store";

const mockPersistLocale = vi.fn();
const mockPersistTheme = vi.fn();

vi.mock(
  "@/modules/settings/hooks/use-user-settings-store",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/modules/settings/hooks/use-user-settings-store")
      >();
    return {
      ...actual,
      useUserSettings: vi.fn(() => ({
        settings: actual.useUserSettingsStore.getState().settings,
        setSettings: actual.useUserSettingsStore.getState().setSettings,
        persistLocale: mockPersistLocale,
        persistTheme: mockPersistTheme,
      })),
    };
  },
);

describe("ThemeSelector", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: { theme: "system" } });
    mockPersistLocale.mockClear();
    mockPersistTheme.mockClear();
  });

  it("renders the trigger with accessible theme label", () => {
    render(<ThemeSelector />);

    expect(
      screen.getByRole("button", { name: "Theme: System" }),
    ).toBeInTheDocument();
  });

  it("opens dropdown when trigger is clicked", () => {
    render(<ThemeSelector />);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Theme: System" }));

    expect(screen.getByRole("listbox", { name: "Theme" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /System/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Light/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Dark/ })).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ThemeSelector />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Theme: System" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("calls persistTheme and closes dropdown when selecting an option", () => {
    render(<ThemeSelector />);

    fireEvent.click(screen.getByRole("button", { name: "Theme: System" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: /Light/ }));

    expect(mockPersistTheme).toHaveBeenCalledWith("light");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown when focus moves outside", () => {
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <ThemeSelector />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Theme: System" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    const outsideButton = screen.getByTestId("outside-button");
    act(() => {
      outsideButton.focus();
      fireEvent.focusIn(outsideButton);
    });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("calls persistTheme when a theme option is clicked", () => {
    render(<ThemeSelector />);

    fireEvent.click(screen.getByRole("button", { name: "Theme: System" }));
    fireEvent.click(screen.getByRole("option", { name: /Dark/ }));

    expect(mockPersistTheme).toHaveBeenCalledTimes(1);
    expect(mockPersistTheme).toHaveBeenCalledWith("dark");
  });

  it("renders empty theme label when store theme has no matching option", () => {
    useUserSettingsStore.setState({
      settings: { theme: "invalid" as Theme },
    });

    render(<ThemeSelector />);

    const button = screen.getByRole("button", { name: /^Theme:/ });
    expect(button).toHaveAttribute("aria-label", "Theme: ");
  });
});
