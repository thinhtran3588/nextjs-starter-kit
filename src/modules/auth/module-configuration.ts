import { asClass, type AwilixContainer } from "awilix";

import { FirebaseAuthenticationService } from "@/modules/auth/services/firebase-auth-service";
import { GetAuthStateSubscriptionUseCase } from "@/modules/auth/use-cases/get-auth-state-subscription-use-case";
import { SendPasswordResetUseCase } from "@/modules/auth/use-cases/send-password-reset-use-case";
import { SignInWithEmailUseCase } from "@/modules/auth/use-cases/sign-in-with-email-use-case";
import { SignInWithGoogleUseCase } from "@/modules/auth/use-cases/sign-in-with-google-use-case";
import { SignOutUseCase } from "@/modules/auth/use-cases/sign-out-use-case";
import { SignUpWithEmailUseCase } from "@/modules/auth/use-cases/sign-up-with-email-use-case";
import { UpdatePasswordUseCase } from "@/modules/auth/use-cases/update-password-use-case";
import { UpdateProfileUseCase } from "@/modules/auth/use-cases/update-profile-use-case";

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    authService: asClass(FirebaseAuthenticationService).singleton(),
    signInWithGoogleUseCase: asClass(SignInWithGoogleUseCase).singleton(),
    signInWithEmailUseCase: asClass(SignInWithEmailUseCase).singleton(),
    signUpWithEmailUseCase: asClass(SignUpWithEmailUseCase).singleton(),
    sendPasswordResetUseCase: asClass(SendPasswordResetUseCase).singleton(),
    signOutUseCase: asClass(SignOutUseCase).singleton(),
    getAuthStateSubscriptionUseCase: asClass(
      GetAuthStateSubscriptionUseCase,
    ).singleton(),
    updateProfileUseCase: asClass(UpdateProfileUseCase).singleton(),
    updatePasswordUseCase: asClass(UpdatePasswordUseCase).singleton(),
  });
}
