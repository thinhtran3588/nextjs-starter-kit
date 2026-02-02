import type { EmptyInput } from "@/common/utils/base-use-case";
import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";
import type { AuthStateSubscription } from "@/modules/auth/domain/types";

export class GetAuthStateSubscriptionUseCase {
  constructor(private readonly authService: BaseAuthenticationService) {}

  execute(_input: EmptyInput): AuthStateSubscription {
    return {
      subscribe: (callback) => this.authService.subscribeToAuthState(callback),
    };
  }
}
