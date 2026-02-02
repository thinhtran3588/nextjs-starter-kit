import { render, screen } from "@testing-library/react";
import { AuthLayout } from "@/modules/auth/components/auth-layout";
import { SignInPage } from "@/modules/auth/pages/sign-in/page";
import { SignUpPage } from "@/modules/auth/pages/sign-up/page";
import { ForgotPasswordPage } from "@/modules/auth/pages/forgot-password/page";
import messages from "@/application/localization/en.json";

describe("Auth pages", () => {
  it("renders the shared auth layout shell", async () => {
    render(
      await AuthLayout({
        children: (
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {messages.modules.auth.pages["sign-in"].title}
            </h1>
          </div>
        ),
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: messages.modules.auth.pages["sign-in"].title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: messages.common.navigation.backToHome }),
    ).toBeInTheDocument();
  });

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
});
