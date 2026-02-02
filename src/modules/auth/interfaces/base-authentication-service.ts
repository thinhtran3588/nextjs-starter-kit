import type { AuthStateCallback } from "@/modules/auth/domain/types";

export interface BaseAuthenticationService {
  signInWithGoogle(): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<void>;
  signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<void>;
  sendPasswordReset(email: string): Promise<void>;
  signOut(): Promise<void>;
  subscribeToAuthState(callback: AuthStateCallback): () => void;
}
