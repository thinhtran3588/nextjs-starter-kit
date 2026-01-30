import { render, screen } from "@testing-library/react";
import { PrivacyPolicyPage } from "@/modules/legal/pages/privacy-policy/page";
import { TermsOfServicePage } from "@/modules/legal/pages/terms-of-service/page";
import messages from "@/application/localization/en.json";

describe("Legal pages", () => {
  it("renders the privacy policy placeholder", async () => {
    render(await PrivacyPolicyPage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.legal.pages["privacy-policy"].title,
      }),
    ).toBeInTheDocument();
  });

  it("renders the terms of service placeholder", async () => {
    render(await TermsOfServicePage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.legal.pages["terms-of-service"].title,
      }),
    ).toBeInTheDocument();
  });
});
