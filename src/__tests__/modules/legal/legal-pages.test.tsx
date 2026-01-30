import { render, screen } from "@testing-library/react";
import { PrivacyPolicyPage } from "@/modules/legal/pages/privacy-policy/page";
import { TermsOfServicePage } from "@/modules/legal/pages/terms-of-service/page";

describe("Legal pages", () => {
  it("renders the privacy policy placeholder", () => {
    render(<PrivacyPolicyPage />);

    expect(
      screen.getByRole("heading", { name: /privacy policy/i }),
    ).toBeInTheDocument();
  });

  it("renders the terms of service placeholder", () => {
    render(<TermsOfServicePage />);

    expect(
      screen.getByRole("heading", { name: /terms of service/i }),
    ).toBeInTheDocument();
  });
});
