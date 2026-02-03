import { asFunction, type AwilixContainer } from "awilix";

import {
  FirebaseAuthenticationService,
  type GetAuthInstance,
} from "@/modules/auth/services/firebase-auth-service";
import { GetAuthStateSubscriptionUseCase } from "@/modules/auth/use-cases/get-auth-state-subscription-use-case";
import { SendPasswordResetUseCase } from "@/modules/auth/use-cases/send-password-reset-use-case";
import { SignInWithEmailUseCase } from "@/modules/auth/use-cases/sign-in-with-email-use-case";
import { SignInWithGoogleUseCase } from "@/modules/auth/use-cases/sign-in-with-google-use-case";
import { SignOutUseCase } from "@/modules/auth/use-cases/sign-out-use-case";
import { SignUpWithEmailUseCase } from "@/modules/auth/use-cases/sign-up-with-email-use-case";
import { UpdatePasswordUseCase } from "@/modules/auth/use-cases/update-password-use-case";
import { UpdateProfileUseCase } from "@/modules/auth/use-cases/update-profile-use-case";

type AuthCradle = {
  authService: InstanceType<typeof FirebaseAuthenticationService>;
  getAuthInstance: GetAuthInstance;
};

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    authService: asFunction(
      (c: AuthCradle) => new FirebaseAuthenticationService(c.getAuthInstance),
    ).singleton(),
    signInWithGoogleUseCase: asFunction(
      (c: AuthCradle) => new SignInWithGoogleUseCase(c.authService),
    ).singleton(),
    signInWithEmailUseCase: asFunction(
      (c: AuthCradle) => new SignInWithEmailUseCase(c.authService),
    ).singleton(),
    signUpWithEmailUseCase: asFunction(
      (c: AuthCradle) => new SignUpWithEmailUseCase(c.authService),
    ).singleton(),
    sendPasswordResetUseCase: asFunction(
      (c: AuthCradle) => new SendPasswordResetUseCase(c.authService),
    ).singleton(),
    signOutUseCase: asFunction(
      (c: AuthCradle) => new SignOutUseCase(c.authService),
    ).singleton(),
    getAuthStateSubscriptionUseCase: asFunction(
      (c: AuthCradle) => new GetAuthStateSubscriptionUseCase(c.authService),
    ).singleton(),
    updateProfileUseCase: asFunction(
      (c: AuthCradle) => new UpdateProfileUseCase(c.authService),
    ).singleton(),
    updatePasswordUseCase: asFunction(
      (c: AuthCradle) => new UpdatePasswordUseCase(c.authService),
    ).singleton(),
  });
}
