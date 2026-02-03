import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SyncUserSettings } from "@/modules/settings/components/sync-user-settings";

const mockUseSyncUserSettings = vi.fn();
vi.mock("@/modules/settings/hooks/use-sync-user-settings", () => ({
  useSyncUserSettings: () => mockUseSyncUserSettings(),
}));

describe("SyncUserSettings", () => {
  it("calls useSyncUserSettings and renders nothing", () => {
    const { container } = render(<SyncUserSettings />);
    expect(mockUseSyncUserSettings).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });
});
