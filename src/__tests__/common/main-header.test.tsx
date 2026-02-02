import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi } from "vitest";
import { MainHeader } from "@/common/components/main-header";
import type { ResolvedMenuItem } from "@/common/interfaces/menu-item";

let mockPathname = "/";
vi.mock("@/common/routing/navigation", async (importOriginal) => {
  const mod =
    await importOriginal<typeof import("@/common/routing/navigation")>();
  return {
    ...mod,
    usePathname: () => mockPathname,
  };
});

vi.mock("@/modules/auth/hooks/use-auth-user-store", () => ({
  useAuthUserStore: (
    selector: (s: { user: null; loading: boolean }) => unknown,
  ) => selector({ user: null, loading: false }),
}));

const menuItems: ResolvedMenuItem[] = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "documents",
    label: "Documents",
    href: "",
    children: [
      { id: "architecture", label: "Architecture", href: "/docs/architecture" },
      {
        id: "development-guide",
        label: "Development guide",
        href: "/docs/development-guide",
      },
      {
        id: "testing-guide",
        label: "Testing guide",
        href: "/docs/testing-guide",
      },
    ],
  },
  { id: "privacy", label: "Privacy", href: "/privacy-policy" },
  { id: "terms", label: "Terms", href: "/terms-of-service" },
];

const baseProps = {
  badge: "Liquid Badge",
  menuItems,
  signInLabel: "Sign in",
  profileLabel: "Profile",
  signOutLabel: "Sign out",
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

describe("MainHeader", () => {
  it("renders the primary navigation", () => {
    render(<MainHeader {...baseProps} />);

    expect(screen.getByText(baseProps.badge)).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText(baseProps.signInLabel)).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(screen.getByText("Terms")).toBeInTheDocument();
  });

  it("highlights the current page in the menu", () => {
    mockPathname = "/";
    render(<MainHeader {...baseProps} />);

    const homeLinks = screen.getAllByRole("link", {
      name: "Home",
    });
    expect(homeLinks.length).toBeGreaterThan(0);
    homeLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("highlights Privacy when on privacy-policy page", () => {
    mockPathname = "/privacy-policy";
    render(<MainHeader {...baseProps} />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const privacyLink = screen.getByRole("link", {
      name: "Privacy",
    });

    expect(homeLink).not.toHaveClass("font-bold");
    expect(privacyLink).toHaveClass("font-bold");
  });

  it("highlights Terms when on terms-of-service page", () => {
    mockPathname = "/terms-of-service";
    render(<MainHeader {...baseProps} />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const termsLink = screen.getByRole("link", { name: "Terms" });

    expect(homeLink).not.toHaveClass("font-bold");
    expect(termsLink).toHaveClass("font-bold");
  });

  it("highlights current page in mobile menu when open", () => {
    mockPathname = "/privacy-policy";
    render(<MainHeader {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const privacyLinks = screen.getAllByRole("link", {
      name: "Privacy",
    });
    expect(privacyLinks.length).toBeGreaterThanOrEqual(1);
    privacyLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("shows Sign in at top of mobile menu", () => {
    render(<MainHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const nav = screen.getByTestId("mobile-menu");
    const linksAndButtons = nav.querySelectorAll("a, button");
    const firstLink = linksAndButtons[0];
    expect(firstLink).toHaveAttribute("href", "/auth/sign-in");
    expect(firstLink).toHaveTextContent(baseProps.signInLabel);
  });

  it("closes mobile menu when a nav link is clicked", () => {
    render(<MainHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();

    fireEvent.click(within(mobileMenu).getByRole("link", { name: "Home" }));
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });

  it("closes mobile menu when a document link is clicked", () => {
    render(<MainHeader {...baseProps} />);
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
    render(<MainHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const architectureLinks = within(
      screen.getByTestId("mobile-menu"),
    ).getAllByRole("link", { name: "Architecture" });
    expect(architectureLinks.length).toBe(1);
    expect(architectureLinks[0]).toHaveClass("font-bold");
  });

  it("highlights Home in mobile menu when on home page", () => {
    mockPathname = "/";
    render(<MainHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const homeLinks = screen.getAllByRole("link", {
      name: "Home",
    });
    homeLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("highlights Terms in mobile menu when on terms page", () => {
    mockPathname = "/terms-of-service";
    render(<MainHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));

    const termsLinks = screen.getAllByRole("link", {
      name: "Terms",
    });
    expect(termsLinks.length).toBeGreaterThanOrEqual(1);
    termsLinks.forEach((link) => {
      expect(link).toHaveClass("font-bold");
    });
  });

  it("hides on scroll down and shows on scroll up", () => {
    setScrollY(0);
    const { container } = render(<MainHeader {...baseProps} />);
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
    const { container } = render(<MainHeader {...baseProps} />);
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
    render(<MainHeader {...baseProps} currentLocale="fr" />);

    const languageButton = screen.getByRole("button", { name: /^Language:/ });
    expect(languageButton).toHaveAttribute("aria-label", "Language: ");
  });

  it("toggles the mobile menu", () => {
    render(<MainHeader {...baseProps} />);

    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: baseProps.menuLabel }));
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
  });
});
