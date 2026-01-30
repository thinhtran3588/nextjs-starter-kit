import { render, screen } from "@testing-library/react";
import { LandingPage } from "@/modules/landing-page/pages/home/page";

describe("LandingPage", () => {
  it("renders the hero headline and main app CTA", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        name: /liquid glass surfaces/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /go to main app/i }),
    ).toHaveLength(2);
  });
});
