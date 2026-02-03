import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BaseUserSettingsRepository } from "@/modules/settings/interfaces/base-user-settings-repository";
import { LoadUserSettingsUseCase } from "@/modules/settings/use-cases/load-user-settings-use-case";

describe("LoadUserSettingsUseCase", () => {
  let loadUseCase: LoadUserSettingsUseCase;
  let mockRepository: BaseUserSettingsRepository;

  beforeEach(() => {
    mockRepository = {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn(),
    };
    loadUseCase = new LoadUserSettingsUseCase(mockRepository);
  });

  it("returns null when userId is null", async () => {
    const result = await loadUseCase.execute({ userId: null });
    expect(result).toBeNull();
    expect(mockRepository.get).not.toHaveBeenCalled();
  });

  it("returns null when userId is set but remote returns null", async () => {
    vi.mocked(mockRepository.get).mockResolvedValue(null);
    const result = await loadUseCase.execute({ userId: "user-1" });
    expect(result).toBeNull();
    expect(mockRepository.get).toHaveBeenCalledWith("user-1");
  });

  it("returns remote when userId is set and remote exists", async () => {
    vi.mocked(mockRepository.get).mockResolvedValue({
      locale: "vi",
      theme: "dark",
    });
    const result = await loadUseCase.execute({ userId: "user-1" });
    expect(result).toEqual({ locale: "vi", theme: "dark" });
  });
});
