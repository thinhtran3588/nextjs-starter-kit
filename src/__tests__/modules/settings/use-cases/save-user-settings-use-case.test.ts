import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LocalUserSettingsStorage } from "@/modules/settings/interfaces/local-user-settings-storage";
import type { UserSettingsRepository } from "@/modules/settings/interfaces/user-settings-repository";
import { SaveUserSettingsUseCase } from "@/modules/settings/use-cases/save-user-settings-use-case";

describe("SaveUserSettingsUseCase", () => {
  let saveUseCase: SaveUserSettingsUseCase;
  let mockLocalStorage: LocalUserSettingsStorage;
  let mockRepository: UserSettingsRepository;

  beforeEach(() => {
    mockLocalStorage = {
      get: vi.fn().mockReturnValue({}),
      set: vi.fn(),
    };
    mockRepository = {
      get: vi.fn(),
      set: vi.fn().mockResolvedValue(undefined),
    };
    saveUseCase = new SaveUserSettingsUseCase(mockLocalStorage, mockRepository);
  });

  it("writes to local storage when userId is null", async () => {
    await saveUseCase.execute({
      userId: null,
      settings: { locale: "en", theme: "dark" },
    });
    expect(mockLocalStorage.set).toHaveBeenCalledWith({
      locale: "en",
      theme: "dark",
    });
    expect(mockRepository.set).not.toHaveBeenCalled();
  });

  it("writes to local storage and repository when userId is set", async () => {
    await saveUseCase.execute({
      userId: "user-1",
      settings: { locale: "vi", theme: "light" },
    });
    expect(mockLocalStorage.set).toHaveBeenCalledWith({
      locale: "vi",
      theme: "light",
    });
    expect(mockRepository.set).toHaveBeenCalledWith("user-1", {
      locale: "vi",
      theme: "light",
    });
  });
});
