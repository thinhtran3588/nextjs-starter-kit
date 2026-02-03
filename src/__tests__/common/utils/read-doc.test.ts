import { beforeEach, describe, expect, it, vi } from "vitest";

import { readDocContent } from "@/common/utils/read-doc";

describe("readDocContent", () => {
  const mockReadFile = vi.fn();

  beforeEach(() => {
    mockReadFile.mockReset();
  });

  it("returns null when file does not exist", async () => {
    mockReadFile.mockRejectedValue(new Error("ENOENT"));
    expect(await readDocContent("invalid", "en", mockReadFile)).toBe(null);
    expect(await readDocContent("", "vi", mockReadFile)).toBe(null);
    expect(mockReadFile).toHaveBeenCalled();
  });

  it("returns content for valid slug and locale en", async () => {
    mockReadFile.mockResolvedValue("# Title\n\nContent");
    const result = await readDocContent("architecture", "en", mockReadFile);
    expect(result).toBe("# Title\n\nContent");
    expect(mockReadFile).toHaveBeenCalledWith(
      expect.stringMatching(/[/\\]docs[/\\]architecture\.md$/),
      "utf-8",
    );
  });

  it("uses locale-suffixed filename for vi", async () => {
    mockReadFile.mockResolvedValue("# Kiến trúc");
    const result = await readDocContent("architecture", "vi", mockReadFile);
    expect(result).toBe("# Kiến trúc");
    expect(mockReadFile).toHaveBeenCalledWith(
      expect.stringMatching(/[/\\]docs[/\\]architecture-vi\.md$/),
      "utf-8",
    );
  });

  it("uses locale-suffixed filename for zh", async () => {
    mockReadFile.mockResolvedValue("# Architecture");
    const result = await readDocContent(
      "development-guide",
      "zh",
      mockReadFile,
    );
    expect(result).toBe("# Architecture");
    expect(mockReadFile).toHaveBeenCalledWith(
      expect.stringMatching(/[/\\]docs[/\\]development-guide-zh\.md$/),
      "utf-8",
    );
  });

  it("returns null on read error", async () => {
    mockReadFile.mockRejectedValue(new Error("ENOENT"));
    const result = await readDocContent("architecture", "vi", mockReadFile);
    expect(result).toBe(null);
  });
});
