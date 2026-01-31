import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi } from "vitest";
import { MarketingHeader } from "@/common/components/layout/marketing-header";

let mockPathname = "/";
vi.mock("@/application/routing/navigation", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("@/application/routing/navigation")>();
  return {
    ...mod,
    usePathname: () => mockPathname,
  };
});

const baseProps = {
  badge: "Liquid Badge",
  homeLabel: "Home",
  signInLabel: "Sign in",
  privacyLabel: "Privacy",
  termsLabel: "Terms",
  documentsLabel: "Documents",
  docItems: [
    { label: "Architecture", href: "/docs/architecture" },
    { label: "Development guide", href: "/docs/development-guide" },
    { label: "Testing guide", href: "/docs/testing-guide" },
  ],
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

  it("highlights the current page in the menu", () => {
    mockPathname = "/";
    render(<MarketingHeader {...baseProps} />);

    const homeLinks = screen.getAllByRole("link", {
      name: baseProps.homeLabel,
    });
    expect(homeLinks.length).toBeGreaterThan(0);
    homeLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("highlights Privacy when on privacy-policy page", () => {
    mockPathname = "/privacy-policy";
    render(<MarketingHeader {...baseProps} />);

    const homeLink = screen.getByRole("link", { name: baseProps.homeLabel });
    const privacyLink = screen.getByRole("link", {
      name: baseProps.privacyLabel,
    });

    expect(homeLink).not.toHaveClass("font-bold");
    expect(privacyLink).toHaveClass("font-bold");
  });

  it("highlights Terms when on terms-of-service page", () => {
    mockPathname = "/terms-of-service";
    render(<MarketingHeader {...baseProps} />);

    const homeLink = screen.getByRole("link", { name: baseProps.homeLabel });
    const termsLink = screen.getByRole("link", { name: baseProps.termsLabel });

    expect(homeLink).not.toHaveClass("font-bold");
    expect(termsLink).toHaveClass("font-bold");
  });

  it("highlights current page in mobile menu when open", () => {
    mockPathname = "/privacy-policy";
    render(<MarketingHeader {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const privacyLinks = screen.getAllByRole("link", {
      name: baseProps.privacyLabel,
    });
    expect(privacyLinks.length).toBeGreaterThanOrEqual(1);
    privacyLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("shows Sign in at top of mobile menu", () => {
    render(<MarketingHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const nav = screen.getByTestId("mobile-menu");
    const linksAndButtons = nav.querySelectorAll("a, button");
    const firstLink = linksAndButtons[0];
    expect(firstLink).toHaveAttribute("href", "/auth/sign-in");
    expect(firstLink).toHaveTextContent(baseProps.signInLabel);
  });

  it("closes mobile menu when a nav link is clicked", () => {
    render(<MarketingHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();

    fireEvent.click(
      within(mobileMenu).getByRole("link", { name: baseProps.homeLabel }),
    );
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("closes mobile menu when a document link is clicked", () => {
    render(<MarketingHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();

    fireEvent.click(
      within(mobileMenu).getByRole("link", { name: "Architecture" }),
    );
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("highlights current document in mobile menu when on docs page", () => {
    mockPathname = "/docs/architecture";
    render(<MarketingHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const architectureLinks = within(
      screen.getByTestId("mobile-menu"),
    ).getAllByRole("link", { name: "Architecture" });
    expect(architectureLinks.length).toBe(1);
    expect(architectureLinks[0]).toHaveClass("font-bold");
  });

  it("highlights Home in mobile menu when on home page", () => {
    mockPathname = "/";
    render(<MarketingHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const homeLinks = screen.getAllByRole("link", {
      name: baseProps.homeLabel,
    });
    homeLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("highlights Terms in mobile menu when on terms page", () => {
    mockPathname = "/terms-of-service";
    render(<MarketingHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const termsLinks = screen.getAllByRole("link", {
      name: baseProps.termsLabel,
    });
    expect(termsLinks.length).toBeGreaterThanOrEqual(1);
    termsLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
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
    render(<MarketingHeader {...baseProps} currentLocale="fr" />);

    const languageButton = screen.getByRole("button", { name: /^Language:/ });
    expect(languageButton).toHaveAttribute("aria-label", "Language: ");
  });

  it("toggles the mobile menu", () => {
    render(<MarketingHeader {...baseProps} />);

    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });
});
