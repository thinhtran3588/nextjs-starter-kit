import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import messages from "@/application/localization/en.json";
import { AuthVerification } from "@/modules/auth/components/auth-verification";
import { AuthType } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import { ForgotPasswordPage } from "@/modules/auth/pages/forgot-password/page";
import { ProfilePage } from "@/modules/auth/pages/profile/page";
import { SignInPage } from "@/modules/auth/pages/sign-in/page";
import { SignUpPage } from "@/modules/auth/pages/sign-up/page";

const mockReplace = vi.fn();
vi.mock("@/common/routing/navigation", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/common/routing/navigation")>();
  return {
    ...actual,
    useRouter: () => ({ ...actual.useRouter(), replace: mockReplace }),
  };
});

describe("Auth pages", () => {
  it("renders the sign in page", async () => {
    render(await SignInPage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.auth.pages["sign-in"].title,
      }),
    ).toBeInTheDocument();
  });

  it("renders the sign up page", async () => {
    render(await SignUpPage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.auth.pages["sign-up"].title,
      }),
    ).toBeInTheDocument();
  });

  it("renders the forgot password page", async () => {
    render(await ForgotPasswordPage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.auth.pages["forgot-password"].title,
      }),
    ).toBeInTheDocument();
  });

  it("renders the profile page when user is set", () => {
    useAuthUserStore.setState({
      user: {
        id: "uid-1",
        email: "a@b.com",
        displayName: "Alice",
        photoURL: null,
        authType: AuthType.Email,
      },
      loading: false,
    });
    render(<ProfilePage />);
    expect(
      screen.getByRole("button", {
        name: messages.modules.auth.pages.profile.saveButton,
      }),
    ).toBeInTheDocument();
  });

  it("redirects to sign-in when profile page is opened with no user", async () => {
    mockReplace.mockClear();
    useAuthUserStore.setState({ user: null, loading: false });

    render(
      <AuthVerification>
        <ProfilePage />
      </AuthVerification>,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/auth/sign-in");
    });
  });
});
