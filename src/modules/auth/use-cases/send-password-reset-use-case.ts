import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";
import type { AuthResult } from "@/modules/auth/domain/types";
import { BaseUseCase } from "@/common/utils/base-use-case";
import { mapAuthErrorCode } from "@/modules/auth/utils/map-auth-error";

export class SendPasswordResetUseCase extends BaseUseCase {
  constructor(private readonly authService: BaseAuthenticationService) {
    super();
  }

  async execute(input: { email: string }): Promise<AuthResult> {
    return this.handle(
      () => this.authService.sendPasswordReset(input.email),
      (err) => mapAuthErrorCode((err as { code?: string })?.code),
    );
  }
}
