import type { AuthResult } from "@/modules/auth/domain/types";
import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";

type UpdatePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

export class UpdatePasswordUseCase {
  constructor(private readonly authService: BaseAuthenticationService) {}

  async execute(input: UpdatePasswordInput): Promise<AuthResult> {
    return this.authService.updatePassword(
      input.oldPassword,
      input.newPassword,
    );
  }
}
