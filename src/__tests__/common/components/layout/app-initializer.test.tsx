import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { initializeContainer } from "@/application/register-container";
import { AppInitializer } from "@/common/components/layout/app-initializer";
import { getContainerOrNull } from "@/common/utils/container";

vi.mock("@/application/register-container", () => ({
  initializeContainer: vi.fn(),
}));
vi.mock("@/common/utils/container", () => ({
  getContainerOrNull: vi.fn(),
}));
vi.mock("@/modules/auth/hooks/use-sync-auth-state", () => ({
  useSyncAuthState: vi.fn(),
}));

describe("AppInitializer (layout)", () => {
  beforeEach(() => {
    vi.mocked(getContainerOrNull).mockReturnValue(null);
  });

  it("renders nothing", () => {
    const { container } = render(<AppInitializer />);
    expect(container.firstChild).toBeNull();
  });

  it("calls initializeContainer when container is null", () => {
    render(<AppInitializer />);
    expect(initializeContainer).toHaveBeenCalled();
  });

  it("does not call initializeContainer when container is already set", () => {
    vi.mocked(getContainerOrNull).mockReturnValue({} as never);
    vi.mocked(initializeContainer).mockClear();
    render(<AppInitializer />);
    expect(initializeContainer).not.toHaveBeenCalled();
  });
});
