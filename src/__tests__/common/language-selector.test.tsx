import { render, screen, fireEvent, act } from "@testing-library/react";
import { LanguageSelector } from "@/common/components/language-selector";

const defaultProps = {
  languageLabel: "Language",
  currentLocale: "en",
  localeOptions: [
    { locale: "en", label: "English", flag: "US" },
    { locale: "vi", label: "Vietnamese", flag: "VN" },
    { locale: "zh", label: "Chinese", flag: "CN" },
  ],
};

describe("LanguageSelector", () => {
  it("renders the trigger with current locale label and flag", () => {
    render(<LanguageSelector {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "Language: English" }),
    ).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("US")).toBeInTheDocument();
  });

  it("uses current pathname for locale links so URL is preserved when changing language", () => {
    render(<LanguageSelector {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));

    const links = screen.getAllByRole("option");
    links.forEach((link) => {
      const anchor = link.closest("a");
      expect(anchor).toHaveAttribute("href", "/");
    });
  });

  it("opens dropdown when trigger is clicked", () => {
    render(<LanguageSelector {...defaultProps} />);

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
        <LanguageSelector {...defaultProps} />
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
        <LanguageSelector {...defaultProps} />
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
    render(<LanguageSelector {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Language: English" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: /Vietnamese/ }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("renders empty locale label when current locale has no matching option", () => {
    render(<LanguageSelector {...defaultProps} currentLocale="fr" />);

    const button = screen.getByRole("button", { name: /^Language:/ });
    expect(button).toHaveAttribute("aria-label", "Language: ");
  });
});
