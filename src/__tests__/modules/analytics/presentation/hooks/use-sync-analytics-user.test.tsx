import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSyncAnalyticsUser } from "@/modules/analytics/presentation/hooks/use-sync-analytics-user";

const mockExecute = vi.fn();
let mockResolve: (key: string) => unknown;

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));

function SyncConsumer() {
  useSyncAnalyticsUser();
  return null;
}

describe("useSyncAnalyticsUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecute.mockClear();
    mockResolve = (key: string) => {
      if (key === "setAnalyticsUserUseCase") {
        return { execute: mockExecute };
      }
      return undefined;
    };
  });

  it("sets analytics user ID to null", () => {
    render(<SyncConsumer />);
    expect(mockExecute).toHaveBeenCalledWith({ userId: null });
  });
});
