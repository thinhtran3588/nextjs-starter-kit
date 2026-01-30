import { render, screen, fireEvent } from "@testing-library/react";
import { MarketingHeader } from "@/common/components/layout/marketing-header";

const baseProps = {
  badge: "Liquid Badge",
  homeLabel: "Home",
  signInLabel: "Sign in",
  privacyLabel: "Privacy",
  termsLabel: "Terms",
  languageLabel: "Language",
  menuLabel: "Menu",
  currentLocale: "en",
  localeOptions: [
    { locale: "en", label: "English", flag: "US" },
    { locale: "vi", label: "Vietnamese", flag: "VN" },
  ],
};

const setScrollY = (value: number) => {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
};

describe("MarketingHeader", () => {
  it("renders the primary navigation", () => {
    render(<MarketingHeader {...baseProps} />);

    expect(screen.getByText(baseProps.badge)).toBeInTheDocument();
    expect(screen.getByText(baseProps.homeLabel)).toBeInTheDocument();
    expect(screen.getByText(baseProps.signInLabel)).toBeInTheDocument();
    expect(screen.getByText(baseProps.privacyLabel)).toBeInTheDocument();
    expect(screen.getByText(baseProps.termsLabel)).toBeInTheDocument();
  });

  it("hides on scroll down and shows on scroll up", () => {
    setScrollY(0);
    const { container } = render(<MarketingHeader {...baseProps} />);
    const header = container.querySelector("header");
    expect(header).not.toBeNull();

    setScrollY(120);
    fireEvent.scroll(window);
    expect(header).toHaveClass("-translate-y-full");

    setScrollY(40);
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");
  });

  it("keeps the header visible near the top", () => {
    setScrollY(0);
    const { container } = render(<MarketingHeader {...baseProps} />);
    const header = container.querySelector("header");
    expect(header).not.toBeNull();

    setScrollY(2);
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");

    setScrollY(20);
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");
  });

  it("renders an empty locale label when missing", () => {
    const { container } = render(
      <MarketingHeader {...baseProps} currentLocale="fr" />,
    );

    const summary = container.querySelector("summary");
    expect(summary).toHaveAttribute("aria-label", "Language: ");
  });

  it("toggles the mobile menu", () => {
    render(<MarketingHeader {...baseProps} />);

    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });
});
