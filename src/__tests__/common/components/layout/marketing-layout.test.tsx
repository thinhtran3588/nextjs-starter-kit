import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("MarketingLayout", () => {
  it("renders MarketingHeader and children", async () => {
    const { MarketingLayout } =
      await import("@/common/components/layout/marketing-layout");
    const result = await MarketingLayout({
      children: <main>Page content</main>,
    });
    render(result);

    expect(screen.getByText("Page content")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
