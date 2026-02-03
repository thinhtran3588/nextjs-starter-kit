import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ThemeSelector } from "@/common/components/theme-selector";
import { useThemeStore } from "@/common/hooks/use-theme-store";

const defaultProps = {
  themeLabel: "Theme",
  themeOptions: [
    { theme: "system" as const, label: "System" },
    { theme: "light" as const, label: "Light" },
    { theme: "dark" as const, label: "Dark" },
  ],
};

describe("ThemeSelector", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "system" });
  });

  it("renders the trigger with current theme label", () => {
    render(<ThemeSelector {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Theme: System" }),
    ).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("opens dropdown when trigger is clicked", () => {
    render(<ThemeSelector {...defaultProps} />);

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
        <ThemeSelector {...defaultProps} />
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Theme: System" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("sets theme and closes dropdown when selecting an option", () => {
    render(<ThemeSelector {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Theme: System" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: /Light/ }));

    expect(useThemeStore.getState().theme).toBe("light");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders empty theme label when current theme has no matching option", () => {
    useThemeStore.setState({ theme: "light" });
    render(
      <ThemeSelector
        themeLabel="Theme"
        themeOptions={[{ theme: "dark", label: "Dark" }]}
      />,
    );

    const button = screen.getByRole("button", { name: /^Theme:/ });
    expect(button).toHaveAttribute("aria-label", "Theme: ");
  });

  it("closes dropdown when focus moves outside", () => {
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <ThemeSelector {...defaultProps} />
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

  it("calls onThemeChange when a theme option is clicked", () => {
    const onThemeChange = vi.fn();
    render(<ThemeSelector {...defaultProps} onThemeChange={onThemeChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Theme: System" }));
    fireEvent.click(screen.getByRole("option", { name: /Dark/ }));

    expect(onThemeChange).toHaveBeenCalledTimes(1);
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });
});
