import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogEvent } from "@/modules/analytics/presentation/hooks/use-log-event";

const mockExecute = vi.fn();
let mockResolve: (key: string) => unknown;

vi.mock("@/common/hooks/use-container", () => ({
  useContainer: () => ({
    resolve: (key: string) => mockResolve(key),
  }),
}));

describe("useLogEvent", () => {
  beforeEach(() => {
    mockExecute.mockClear();
    mockResolve = (key: string) => {
      if (key === "logEventUseCase") {
        return { execute: mockExecute };
      }
      return undefined;
    };
  });

  it("logs event using use case", () => {
    const { result } = renderHook(() => useLogEvent());

    result.current.logEvent("test_event", { foo: "bar" });

    expect(mockExecute).toHaveBeenCalledWith({
      eventName: "test_event",
      params: { foo: "bar" },
    });
  });
});
