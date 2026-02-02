import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SyncAuthState } from "@/modules/auth/components/sync-auth-state";

const mockUseSyncAuthState = vi.fn();

vi.mock("@/modules/auth/hooks/use-sync-auth-state", () => ({
  useSyncAuthState: () => mockUseSyncAuthState(),
}));

describe("SyncAuthState", () => {
  it("calls useSyncAuthState and renders nothing", () => {
    const { container } = render(<SyncAuthState />);

    expect(mockUseSyncAuthState).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });
});
