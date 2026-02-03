import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BaseUserSettingsRepository } from "@/modules/settings/interfaces/base-user-settings-repository";
import { SaveUserSettingsUseCase } from "@/modules/settings/use-cases/save-user-settings-use-case";

describe("SaveUserSettingsUseCase", () => {
  let saveUseCase: SaveUserSettingsUseCase;
  let mockRepository: BaseUserSettingsRepository;

  beforeEach(() => {
    mockRepository = {
      get: vi.fn(),
      set: vi.fn().mockResolvedValue(undefined),
    };
    saveUseCase = new SaveUserSettingsUseCase(mockRepository);
  });

  it("does not call repository when userId is null", async () => {
    await saveUseCase.execute({
      userId: null,
      settings: { locale: "en", theme: "dark" },
    });
    expect(mockRepository.set).not.toHaveBeenCalled();
  });

  it("writes to repository when userId is set", async () => {
    await saveUseCase.execute({
      userId: "user-1",
      settings: { locale: "vi", theme: "light" },
    });
    expect(mockRepository.set).toHaveBeenCalledWith("user-1", {
      locale: "vi",
      theme: "light",
    });
  });
});
