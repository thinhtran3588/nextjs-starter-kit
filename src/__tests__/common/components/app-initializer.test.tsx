import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppInitializer } from "@/common/components/app-initializer";

const [mockInitializeContainer, mockGetContainerOrNull, mockUseSyncAuthState] =
  vi.hoisted(() => [vi.fn(), vi.fn(), vi.fn()]);

vi.mock("@/application/register-container", () => ({
  initializeContainer: mockInitializeContainer,
}));

vi.mock("@/common/utils/container", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/common/utils/container")>();
  return {
    ...mod,
    getContainerOrNull: (...args: unknown[]) => mockGetContainerOrNull(...args),
  };
});

vi.mock("@/modules/auth/hooks/use-sync-auth-state", () => ({
  useSyncAuthState: (...args: unknown[]) => mockUseSyncAuthState(...args),
}));

describe("AppInitializer (common)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls initializeContainer when container is null", () => {
    mockGetContainerOrNull.mockReturnValue(null);

    render(<AppInitializer />);

    expect(mockInitializeContainer).toHaveBeenCalledTimes(1);
    expect(mockUseSyncAuthState).toHaveBeenCalled();
  });

  it("does not call initializeContainer when container is already set", () => {
    mockGetContainerOrNull.mockReturnValue({});

    render(<AppInitializer />);

    expect(mockInitializeContainer).not.toHaveBeenCalled();
    expect(mockUseSyncAuthState).toHaveBeenCalled();
  });
});
