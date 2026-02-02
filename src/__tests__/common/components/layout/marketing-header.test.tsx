import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MarketingHeader } from "@/common/components/layout/marketing-header";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- test mock for next/image
    <img src={src} alt={alt} />
  ),
}));

const defaultProps = {
  badge: "Badge",
  homeLabel: "Home",
  signInLabel: "Sign in",
  privacyLabel: "Privacy",
  termsLabel: "Terms",
  languageLabel: "Language",
  menuLabel: "Menu",
  currentLocale: "en",
  localeOptions: [
    { locale: "en", label: "English", flag: "🇺🇸" },
    { locale: "vi", label: "Vietnamese", flag: "🇻🇳" },
  ],
};

describe("MarketingHeader", () => {
  it("renders badge, nav links, language selector and sign in", () => {
    render(<MarketingHeader {...defaultProps} />);

    expect(screen.getByText("Badge")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Privacy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Language: English/)).toBeInTheDocument();
  });

  it("shows mobile menu when menu button is clicked", () => {
    render(<MarketingHeader {...defaultProps} />);

    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });

  it("uses empty label when current locale not in options", () => {
    const { container } = render(
      <MarketingHeader {...defaultProps} currentLocale="fr" />,
    );
    const summary = container.querySelector('summary[aria-label="Language: "]');
    expect(summary).toBeInTheDocument();
  });

  it("hides header on scroll down and shows on scroll up", () => {
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
    const { container } = render(<MarketingHeader {...defaultProps} />);
    const header = container.querySelector("header");
    expect(header).not.toHaveClass("-translate-y-full");

    Object.defineProperty(window, "scrollY", {
      value: 100,
      writable: true,
      configurable: true,
    });
    fireEvent.scroll(window);
    expect(header).toHaveClass("-translate-y-full");

    Object.defineProperty(window, "scrollY", {
      value: 50,
      writable: true,
      configurable: true,
    });
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");

    Object.defineProperty(window, "scrollY", {
      value: 20,
      writable: true,
      configurable: true,
    });
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");
  });

  it("ignores scroll when delta is below threshold", () => {
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
      configurable: true,
    });
    const { container } = render(<MarketingHeader {...defaultProps} />);
    const header = container.querySelector("header");

    Object.defineProperty(window, "scrollY", {
      value: 2,
      writable: true,
      configurable: true,
    });
    fireEvent.scroll(window);
    expect(header).not.toHaveClass("-translate-y-full");
  });
});
