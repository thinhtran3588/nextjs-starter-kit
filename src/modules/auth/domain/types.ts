export type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

export type AuthErrorCode =
  | "invalid-credentials"
  | "too-many-requests"
  | "email-already-in-use"
  | "generic";

export type AuthResult =
  | { success: true }
  | { success: false; error: AuthErrorCode };

export type AuthStateCallback = (user: AuthUser | null) => void;

export type AuthStateSubscription = {
  subscribe: (callback: AuthStateCallback) => () => void;
};
