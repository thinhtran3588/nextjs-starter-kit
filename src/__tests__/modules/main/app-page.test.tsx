import { render, screen } from "@testing-library/react";
import { AppPage } from "@/modules/main/pages/app/page";

describe("AppPage", () => {
  it("renders placeholder title and navigation", () => {
    render(<AppPage />);

    expect(
      screen.getByRole("heading", { name: /main app/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to home/i }),
    ).toBeInTheDocument();
  });
});
