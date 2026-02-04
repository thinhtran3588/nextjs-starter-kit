import { BaseUseCase } from "@/common/utils/base-use-case";
import type {
  SaveUserSettingsResult,
  UserSettings,
} from "@/modules/settings/domain/types";
import type { BaseUserSettingsRepository } from "@/modules/settings/interfaces/base-user-settings-repository";
import { mapSettingsError } from "@/modules/settings/utils/map-settings-error";

type SaveUserSettingsInput = { userId: string | null; settings: UserSettings };

export class SaveUserSettingsUseCase extends BaseUseCase {
  constructor(private readonly repository: BaseUserSettingsRepository) {
    super();
  }

  async execute(input: SaveUserSettingsInput): Promise<SaveUserSettingsResult> {
    if (!input.userId) {
      return { success: true };
    }
    return this.handle(
      () => this.repository.set(input.userId!, input.settings),
      (err) => mapSettingsError(err),
    );
  }
}
