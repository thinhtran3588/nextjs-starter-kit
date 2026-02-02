import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { RootLayout } from "@/common/components/layout/root-layout";

vi.mock("@/modules/auth/hooks/use-sync-auth-state", () => ({
  useSyncAuthState: () => {},
}));

describe("RootLayout", () => {
  it("renders children", () => {
    render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
