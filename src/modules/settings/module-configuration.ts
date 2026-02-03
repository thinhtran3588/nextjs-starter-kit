import { asFunction, type AwilixContainer } from "awilix";

import { FirestoreUserSettingsRepository } from "@/modules/settings/repositories/firestore-user-settings-repository";
import { LoadUserSettingsUseCase } from "@/modules/settings/use-cases/load-user-settings-use-case";
import { SaveUserSettingsUseCase } from "@/modules/settings/use-cases/save-user-settings-use-case";
import { LocalStorageUserSettings } from "@/modules/settings/utils/local-storage-user-settings";

type GetFirestoreInstance = () => import("firebase/firestore").Firestore | null;

type SettingsCradle = {
  getFirestoreInstance: GetFirestoreInstance;
  localUserSettingsStorage: InstanceType<typeof LocalStorageUserSettings>;
  userSettingsRepository: InstanceType<typeof FirestoreUserSettingsRepository>;
};

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    localUserSettingsStorage: asFunction(
      () => new LocalStorageUserSettings(),
    ).singleton(),
    userSettingsRepository: asFunction(
      (c: { getFirestoreInstance: GetFirestoreInstance }) =>
        new FirestoreUserSettingsRepository(c.getFirestoreInstance),
    ).singleton(),
    loadUserSettingsUseCase: asFunction(
      (c: SettingsCradle) =>
        new LoadUserSettingsUseCase(
          c.localUserSettingsStorage,
          c.userSettingsRepository,
        ),
    ).singleton(),
    saveUserSettingsUseCase: asFunction(
      (c: SettingsCradle) =>
        new SaveUserSettingsUseCase(
          c.localUserSettingsStorage,
          c.userSettingsRepository,
        ),
    ).singleton(),
  });
}
