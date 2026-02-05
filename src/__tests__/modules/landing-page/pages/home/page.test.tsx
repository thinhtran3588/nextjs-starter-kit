import { render, screen } from "@testing-library/react";

import messages from "@/application/localization/en.json";
import { LandingPage } from "@/modules/landing-page/presentation/pages/home/page";

describe("LandingPage", () => {
  it("renders the hero headline and main app CTA", async () => {
    render(await LandingPage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.landing.pages.home.hero.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: messages.common.navigation.goToApp,
      }),
    ).toBeInTheDocument();
  });
});
