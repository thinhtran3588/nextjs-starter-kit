import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LocalUserSettingsStorage } from "@/modules/settings/interfaces/local-user-settings-storage";
import type { UserSettingsRepository } from "@/modules/settings/interfaces/user-settings-repository";
import { LoadUserSettingsUseCase } from "@/modules/settings/use-cases/load-user-settings-use-case";

describe("LoadUserSettingsUseCase", () => {
  let loadUseCase: LoadUserSettingsUseCase;
  let mockLocalStorage: LocalUserSettingsStorage;
  let mockRepository: UserSettingsRepository;

  beforeEach(() => {
    mockLocalStorage = {
      get: vi.fn().mockReturnValue({}),
      set: vi.fn(),
    };
    mockRepository = {
      get: vi.fn().mockResolvedValue(null),
      set: vi.fn(),
    };
    loadUseCase = new LoadUserSettingsUseCase(mockLocalStorage, mockRepository);
  });

  it("returns local settings when userId is null", async () => {
    vi.mocked(mockLocalStorage.get).mockReturnValue({
      locale: "en",
      theme: "dark",
    });
    const result = await loadUseCase.execute({ userId: null });
    expect(result).toEqual({ locale: "en", theme: "dark" });
    expect(mockRepository.get).not.toHaveBeenCalled();
  });

  it("returns local settings when userId is set but remote returns null", async () => {
    vi.mocked(mockLocalStorage.get).mockReturnValue({ locale: "vi" });
    vi.mocked(mockRepository.get).mockResolvedValue(null);
    const result = await loadUseCase.execute({ userId: "user-1" });
    expect(result).toEqual({ locale: "vi" });
    expect(mockRepository.get).toHaveBeenCalledWith("user-1");
  });

  it("merges remote over local when userId is set and remote exists", async () => {
    vi.mocked(mockLocalStorage.get).mockReturnValue({
      locale: "en",
      theme: "light",
    });
    vi.mocked(mockRepository.get).mockResolvedValue({
      locale: "vi",
      theme: "dark",
    });
    const result = await loadUseCase.execute({ userId: "user-1" });
    expect(result).toEqual({ locale: "vi", theme: "dark" });
  });
});
