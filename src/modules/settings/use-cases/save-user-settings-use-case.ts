import type { UserSettings } from "@/modules/settings/domain/types";
import type { BaseUserSettingsRepository } from "@/modules/settings/interfaces/base-user-settings-repository";

type SaveUserSettingsInput = { userId: string | null; settings: UserSettings };

export class SaveUserSettingsUseCase {
  constructor(private readonly repository: BaseUserSettingsRepository) {}

  async execute(input: SaveUserSettingsInput): Promise<void> {
    if (input.userId) {
      await this.repository.set(input.userId, input.settings);
    }
  }
}
