import type { AuthResult } from "@/modules/auth/domain/types";
import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";

type UpdateProfileInput = { displayName: string };

export class UpdateProfileUseCase {
  constructor(private readonly authService: BaseAuthenticationService) {}

  async execute(input: UpdateProfileInput): Promise<AuthResult> {
    return this.authService.updateDisplayName(input.displayName);
  }
}
