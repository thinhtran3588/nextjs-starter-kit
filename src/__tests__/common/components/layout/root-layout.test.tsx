import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RootLayout } from "@/common/components/layout/root-layout";

describe("RootLayout (layout)", () => {
  it("renders children inside a min-h-screen div", () => {
    render(
      <RootLayout>
        <span>Child content</span>
      </RootLayout>,
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
    const wrapper = screen.getByText("Child content").parentElement;
    expect(wrapper).toHaveClass("min-h-screen");
  });
});
