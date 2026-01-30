import { render, screen } from "@testing-library/react";
import { AuthLayout } from "@/modules/auth/components/auth-layout";
import { AuthPageContent } from "@/modules/auth/components/auth-page-content";
import { SignInPage } from "@/modules/auth/pages/sign-in/page";
import { SignUpPage } from "@/modules/auth/pages/sign-up/page";
import { ForgotPasswordPage } from "@/modules/auth/pages/forgot-password/page";

describe("Auth pages", () => {
  it("renders the shared auth layout shell", () => {
    render(
      <AuthLayout>
        <AuthPageContent title="Sign in" />
      </AuthLayout>,
    );

    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("renders the sign in page", () => {
    render(<SignInPage />);

    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("renders the sign up page", () => {
    render(<SignUpPage />);

    expect(
      screen.getByRole("heading", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("renders the forgot password page", () => {
    render(<ForgotPasswordPage />);

    expect(
      screen.getByRole("heading", { name: /forgot password/i }),
    ).toBeInTheDocument();
  });
});
