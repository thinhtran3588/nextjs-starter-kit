import { act, fireEvent, render, screen } from "@testing-library/react";
import { useLocale } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import messages from "@/application/localization/en.json";
import { LanguageSelector } from "@/modules/settings/components/language-selector";
import { useUserSettings } from "@/modules/settings/hooks/use-user-settings-store";

vi.mock(
  "@/modules/settings/hooks/use-user-settings-store",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/modules/settings/hooks/use-user-settings-store")
      >();
    return { ...actual, useUserSettings: vi.fn() };
  },
);

const enFlags = messages.settings.language.flags as Record<string, string>;

describe("LanguageSelector", () => {
  beforeEach(() => {
    vi.mocked(useLocale).mockReturnValue("en");
    vi.mocked(useUserSettings).mockReturnValue({
      settings: {},
      setSettings: vi.fn(),
      persistLocale: vi.fn(),
      persistTheme: vi.fn(),
    });
  });

  it("renders the trigger with current locale label and flag", () => {
    render(<LanguageSelector />);

    expect(
      screen.getByRole("button", { name: "Language: English" }),
    ).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText(enFlags.en)).toBeInTheDocument();
  });

  it("uses current pathname for locale links so URL is preserved when changing language", () => {
    render(<LanguageSelector />);

    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));

    const links = screen.getAllByRole("option");
    links.forEach((link) => {
      const anchor = link.closest("a");
      expect(anchor).toHaveAttribute("href", "/");
    });
  });

  it("opens dropdown when trigger is clicked", () => {
    render(<LanguageSelector />);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));

    expect(
      screen.getByRole("listbox", { name: "Language" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /English/ })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /Vietnamese/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Chinese/ })).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <LanguageSelector />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown when focus moves outside", () => {
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <LanguageSelector />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    const outsideButton = screen.getByTestId("outside-button");
    act(() => {
      outsideButton.focus();
      fireEvent.focusIn(outsideButton);
    });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown when selecting a locale", () => {
    render(<LanguageSelector />);

    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: /Vietnamese/ }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders empty locale label when current locale has no matching option", () => {
    vi.mocked(useLocale).mockReturnValue("fr" as "en");
    render(<LanguageSelector />);

    const button = screen.getByRole("button", { name: /^Language:/ });
    expect(button).toHaveAttribute("aria-label", "Language: ");
  });

  it("calls persistLocale when a locale option is clicked", () => {
    const persistLocaleMock = vi.fn();
    vi.mocked(useUserSettings).mockReturnValue({
      settings: {},
      setSettings: vi.fn(),
      persistLocale: persistLocaleMock,
      persistTheme: vi.fn(),
    });

    render(<LanguageSelector />);

    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));
    fireEvent.click(screen.getByRole("option", { name: /Vietnamese/ }));

    expect(persistLocaleMock).toHaveBeenCalledTimes(1);
    expect(persistLocaleMock).toHaveBeenCalledWith("vi");
  });
});
