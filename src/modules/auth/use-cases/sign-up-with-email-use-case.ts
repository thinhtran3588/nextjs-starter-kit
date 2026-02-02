import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";
import type { AuthResult } from "@/modules/auth/domain/types";
import { BaseUseCase } from "@/common/utils/base-use-case";
import { mapAuthErrorCode } from "@/modules/auth/utils/map-auth-error";

export class SignUpWithEmailUseCase extends BaseUseCase {
  constructor(private readonly authService: BaseAuthenticationService) {
    super();
  }

  async execute(input: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<AuthResult> {
    return this.handle(
      () =>
        this.authService.signUpWithEmail(
          input.email,
          input.password,
          input.displayName,
        ),
      (err) => mapAuthErrorCode((err as { code?: string })?.code),
    );
  }
}
