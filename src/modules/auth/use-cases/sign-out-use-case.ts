import { BaseUseCase, type EmptyInput } from "@/common/utils/base-use-case";
import type { AuthResult } from "@/modules/auth/domain/types";
import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";
import { mapAuthErrorCode } from "@/modules/auth/utils/map-auth-error";

export class SignOutUseCase extends BaseUseCase {
  constructor(private readonly authService: BaseAuthenticationService) {
    super();
  }

  async execute(_input: EmptyInput): Promise<AuthResult> {
    return this.handle(
      () => this.authService.signOut(),
      (err) => mapAuthErrorCode((err as { code?: string })?.code),
    );
  }
}
