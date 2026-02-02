import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "@/common/components/ui/label";

describe("Label (ui)", () => {
  it("renders a label with text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("forwards ref to the label element", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Name</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("applies htmlFor when provided", () => {
    render(<Label htmlFor="input-id">Field</Label>);
    expect(screen.getByText("Field")).toHaveAttribute("for", "input-id");
  });
});
