import { asFunction, type AwilixContainer } from "awilix";

import { FirestoreUserSettingsRepository } from "@/modules/settings/repositories/firestore-user-settings-repository";
import { LoadUserSettingsUseCase } from "@/modules/settings/use-cases/load-user-settings-use-case";
import { SaveUserSettingsUseCase } from "@/modules/settings/use-cases/save-user-settings-use-case";

type GetFirestoreInstance = () => import("firebase/firestore").Firestore | null;

type SettingsCradle = {
  getFirestoreInstance: GetFirestoreInstance;
  userSettingsRepository: InstanceType<typeof FirestoreUserSettingsRepository>;
};

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    userSettingsRepository: asFunction(
      (c: { getFirestoreInstance: GetFirestoreInstance }) =>
        new FirestoreUserSettingsRepository(c.getFirestoreInstance),
    ).singleton(),
    loadUserSettingsUseCase: asFunction(
      (c: SettingsCradle) =>
        new LoadUserSettingsUseCase(c.userSettingsRepository),
    ).singleton(),
    saveUserSettingsUseCase: asFunction(
      (c: SettingsCradle) =>
        new SaveUserSettingsUseCase(c.userSettingsRepository),
    ).singleton(),
  });
}
