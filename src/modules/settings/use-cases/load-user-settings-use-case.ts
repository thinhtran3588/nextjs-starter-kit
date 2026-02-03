import type { UserSettings } from "@/modules/settings/domain/types";
import type { BaseUserSettingsRepository } from "@/modules/settings/interfaces/base-user-settings-repository";

type LoadUserSettingsInput = { userId: string | null };

export class LoadUserSettingsUseCase {
  constructor(private readonly repository: BaseUserSettingsRepository) {}

  async execute(input: LoadUserSettingsInput): Promise<UserSettings | null> {
    if (!input.userId) return null;
    return this.repository.get(input.userId);
  }
}
