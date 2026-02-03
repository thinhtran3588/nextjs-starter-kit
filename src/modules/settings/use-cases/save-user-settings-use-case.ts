import type { UserSettings } from "@/modules/settings/domain/types";
import type { LocalUserSettingsStorage } from "@/modules/settings/interfaces/local-user-settings-storage";
import type { UserSettingsRepository } from "@/modules/settings/interfaces/user-settings-repository";

type SaveUserSettingsInput = { userId: string | null; settings: UserSettings };

export class SaveUserSettingsUseCase {
  constructor(
    private readonly localStorage: LocalUserSettingsStorage,
    private readonly repository: UserSettingsRepository,
  ) {}

  async execute(input: SaveUserSettingsInput): Promise<void> {
    this.localStorage.set(input.settings);
    if (input.userId) {
      await this.repository.set(input.userId, input.settings);
    }
  }
}
