import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthHeaderSlot } from "@/modules/auth/components/auth-header-slot";

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: vi.fn(),
  }),
}));

let mockUser: {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
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
    render(
      <AuthHeaderSlot
        signInLabel="Sign in"
        profileLabel="Profile"
        signOutLabel="Sign out"
      />,
    );

    const link = screen.getByRole("link", { name: "Sign in" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/auth/sign-in");
  });

  it("renders loading skeleton when loading", () => {
    mockLoading = true;

    render(
      <AuthHeaderSlot
        signInLabel="Sign in"
        profileLabel="Profile"
        signOutLabel="Sign out"
      />,
    );

    expect(screen.getByTestId("auth-loading")).toBeInTheDocument();
  });

  it("renders user dropdown when user is set", () => {
    mockUser = {
      id: "uid-1",
      email: "a@b.com",
      displayName: "Alice",
      photoURL: null,
    };

    render(
      <AuthHeaderSlot
        signInLabel="Sign in"
        profileLabel="Profile"
        signOutLabel="Sign out"
      />,
    );

    expect(screen.getByRole("button", { name: "Alice" })).toBeInTheDocument();
  });
});
