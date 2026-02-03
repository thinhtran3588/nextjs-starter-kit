import type { UserSettings } from "@/modules/settings/domain/types";
import type { LocalUserSettingsStorage } from "@/modules/settings/interfaces/local-user-settings-storage";
import type { UserSettingsRepository } from "@/modules/settings/interfaces/user-settings-repository";

type LoadUserSettingsInput = { userId: string | null };

export class LoadUserSettingsUseCase {
  constructor(
    private readonly localStorage: LocalUserSettingsStorage,
    private readonly repository: UserSettingsRepository,
  ) {}

  async execute(input: LoadUserSettingsInput): Promise<UserSettings> {
    const local = this.localStorage.get();
    if (!input.userId) return local;
    const remote = await this.repository.get(input.userId);
    if (!remote) return local;
    return { ...local, ...remote };
  }
}
