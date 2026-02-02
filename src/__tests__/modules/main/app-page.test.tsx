import { render, screen } from "@testing-library/react";

import messages from "@/application/localization/en.json";
import { AppPage } from "@/modules/main/pages/app/page";

describe("AppPage", () => {
  it("renders placeholder title and navigation", async () => {
    render(await AppPage());

    expect(
      screen.getByRole("heading", {
        name: messages.modules.main.pages.app.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: messages.common.navigation.backToHome }),
    ).toBeInTheDocument();
  });
});
