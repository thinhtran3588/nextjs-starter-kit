import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlatformDownload } from "@/modules/landing-page/presentation/pages/home/components/platform-download";

// Mock translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock useLogEvent
const mockLogEvent = vi.fn();
vi.mock("@/modules/analytics/presentation/hooks/use-log-event", () => ({
  useLogEvent: () => ({
    logEvent: mockLogEvent,
  }),
}));

describe("PlatformDownload", () => {
  beforeEach(() => {
    mockLogEvent.mockClear();
  });

  it("renders all platform links", () => {
    render(<PlatformDownload />);

    expect(screen.getByText("platforms.web")).toBeInTheDocument();
    expect(screen.getByText("platforms.android")).toBeInTheDocument();
    expect(screen.getByText("platforms.ios")).toBeInTheDocument();
    expect(screen.getByText("platforms.macos")).toBeInTheDocument();
  });

  it("logs event on click", () => {
    render(<PlatformDownload />);

    const webLink = screen.getByText("platforms.web").closest("a");
    if (!webLink) throw new Error("Link not found");
    fireEvent.click(webLink);

    expect(mockLogEvent).toHaveBeenCalledWith("download_click", {
      platform: "web",
    });
  });
});
