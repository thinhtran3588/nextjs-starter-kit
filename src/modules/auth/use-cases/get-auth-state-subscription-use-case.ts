import type { EmptyInput } from "@/common/utils/base-use-case";
import type { AuthStateSubscription } from "@/modules/auth/domain/types";
import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";

export class GetAuthStateSubscriptionUseCase {
  constructor(private readonly authService: BaseAuthenticationService) {}

  execute(_input: EmptyInput): AuthStateSubscription {
    return {
      subscribe: (callback) => this.authService.subscribeToAuthState(callback),
    };
  }
}
