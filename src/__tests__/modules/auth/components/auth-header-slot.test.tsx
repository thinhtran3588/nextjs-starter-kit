import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthHeaderSlot } from "@/modules/auth/components/auth-header-slot";

const mockSignOutExecute = vi.fn().mockResolvedValue(undefined);

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: vi.fn(() => ({
    resolve: (name: string) =>
      name === "signOutUseCase" ? { execute: mockSignOutExecute } : {},
  })),
}));

let mockUser: {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  authType: "email" | "google" | "apple" | "other";
} | null = null;
let mockLoading = false;

vi.mock("@/modules/auth/hooks/use-auth-user-store", () => ({
  useAuthUserStore: (
    selector: (s: { user: typeof mockUser; loading: boolean }) => unknown,
  ) => selector({ user: mockUser, loading: mockLoading }),
}));

describe("AuthHeaderSlot", () => {
  beforeEach(() => {
    mockUser = null;
    mockLoading = false;
  });

  it("renders sign-in link when user is null and not loading", () => {
    render(<AuthHeaderSlot />);

    const link = screen.getByRole("link", { name: "Sign in" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/auth/sign-in");
  });

  it("renders loading skeleton when loading", () => {
    mockLoading = true;

    render(<AuthHeaderSlot />);

    expect(screen.getByTestId("auth-loading")).toBeInTheDocument();
  });

  it("renders user dropdown when user is set", () => {
    mockUser = {
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      authType: "email",
    };

    render(<AuthHeaderSlot />);

    expect(screen.getByRole("button", { name: "Alice" })).toBeInTheDocument();
  });

  it("renders email when user has no displayName", () => {
    mockUser = {
      id: "uid-1",
      email: "a@b.com",
      displayName: null,
      photoURL: null,
      authType: "email",
    };

    render(<AuthHeaderSlot />);

    expect(screen.getByRole("button", { name: "a@b.com" })).toBeInTheDocument();
  });

  it("renders sign-in label when user has no displayName and no email", () => {
    mockUser = {
      id: "uid-1",
      email: null,
      displayName: null,
      photoURL: null,
      authType: "other",
    };

    render(<AuthHeaderSlot />);

    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders profile link when user is set and dropdown is open", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    mockUser = {
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      authType: "email",
    };

    render(<AuthHeaderSlot />);
    await user.click(screen.getByRole("button", { name: "Alice" }));
    const profileLink = await screen.findByRole("menuitem", {
      name: "Profile",
    });
    expect(profileLink).toHaveAttribute("href", "/auth/profile");
  });

  it("calls signOut when sign out is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    mockUser = {
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
      authType: "email",
    };
    mockSignOutExecute.mockClear();

    render(<AuthHeaderSlot />);
    await user.click(screen.getByRole("button", { name: "Alice" }));
    const signOutItem = await screen.findByRole("menuitem", {
      name: "Sign out",
    });
    await user.click(signOutItem);

    expect(mockSignOutExecute).toHaveBeenCalledWith({});
  });
});
