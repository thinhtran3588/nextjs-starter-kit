"use client";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import type { Auth } from "firebase/auth";
import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";
import type { AuthUser } from "@/modules/auth/domain/types";

export type GetAuthInstance = () => Auth | null;

function getAuthOrThrow(getAuthInstance: GetAuthInstance): Auth {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Auth not available");
  return auth;
}

function mapFirebaseUserToAuthUser(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): AuthUser {
  return {
    id: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
  };
}

export class FirebaseAuthenticationService implements BaseAuthenticationService {
  constructor(private readonly getAuthInstance: GetAuthInstance) {}

  async signInWithGoogle(): Promise<void> {
    await signInWithPopup(
      getAuthOrThrow(this.getAuthInstance),
      new GoogleAuthProvider(),
    );
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(
      getAuthOrThrow(this.getAuthInstance),
      email,
      password,
    );
  }

  async signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<void> {
    const { user } = await createUserWithEmailAndPassword(
      getAuthOrThrow(this.getAuthInstance),
      email,
      password,
    );
    if (displayName?.trim()) {
      await updateProfile(user, { displayName: displayName.trim() });
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(getAuthOrThrow(this.getAuthInstance), email);
  }

  async signOut(): Promise<void> {
    const auth = this.getAuthInstance();
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
    const auth = this.getAuthInstance();
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? mapFirebaseUserToAuthUser(firebaseUser) : null);
    });
  }
}
