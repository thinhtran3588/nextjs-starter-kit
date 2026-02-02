import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAuthInstance } from "@/application/config/firebase-config";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { FirebaseAuthenticationService } from "@/modules/auth/services/firebase-auth-service";

const mockUnsubscribe = vi.fn();

describe("FirebaseAuthenticationService", () => {
  let service: FirebaseAuthenticationService;

  beforeEach(() => {
    vi.mocked(getAuthInstance).mockReset();
    vi.mocked(signInWithPopup).mockReset();
    vi.mocked(signInWithEmailAndPassword).mockReset();
    vi.mocked(createUserWithEmailAndPassword).mockReset();
    vi.mocked(updateProfile).mockReset();
    vi.mocked(sendPasswordResetEmail).mockReset();
    vi.mocked(signOut).mockReset();
    vi.mocked(onAuthStateChanged).mockReset().mockReturnValue(mockUnsubscribe);
    service = new FirebaseAuthenticationService();
  });

  it("signInWithGoogle throws when auth is not available", async () => {
    vi.mocked(getAuthInstance).mockReturnValue(null);
    await expect(service.signInWithGoogle()).rejects.toThrow(
      "Auth not available",
    );
  });

  it("signInWithEmail throws when auth is not available", async () => {
    vi.mocked(getAuthInstance).mockReturnValue(null);
    await expect(service.signInWithEmail("a@b.com", "pass")).rejects.toThrow(
      "Auth not available",
    );
  });

  it("signUpWithEmail throws when auth is not available", async () => {
    vi.mocked(getAuthInstance).mockReturnValue(null);
    await expect(service.signUpWithEmail("a@b.com", "pass")).rejects.toThrow(
      "Auth not available",
    );
  });

  it("sendPasswordReset throws when auth is not available", async () => {
    vi.mocked(getAuthInstance).mockReturnValue(null);
    await expect(service.sendPasswordReset("a@b.com")).rejects.toThrow(
      "Auth not available",
    );
  });

  it("signOut returns without throwing when auth is null", async () => {
    vi.mocked(getAuthInstance).mockReturnValue(null);
    await expect(service.signOut()).resolves.toBeUndefined();
  });

  it("subscribeToAuthState calls callback with null and returns no-op when auth is null", () => {
    vi.mocked(getAuthInstance).mockReturnValue(null);
    const callback = vi.fn();
    const unsubscribe = service.subscribeToAuthState(callback);
    expect(callback).toHaveBeenCalledWith(null);
    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
    expect(mockUnsubscribe).not.toHaveBeenCalled();
  });

  it("when auth is available, signInWithGoogle calls signInWithPopup", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    vi.mocked(getAuthInstance).mockReturnValue(mockAuth);
    vi.mocked(signInWithPopup).mockResolvedValue({} as never);
    await service.signInWithGoogle();
    expect(signInWithPopup).toHaveBeenCalledWith(mockAuth, expect.anything());
  });

  it("when auth is available, signInWithEmail calls signInWithEmailAndPassword", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    vi.mocked(getAuthInstance).mockReturnValue(mockAuth);
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: {},
    } as never);
    await service.signInWithEmail("a@b.com", "pass");
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      "a@b.com",
      "pass",
    );
  });

  it("when auth is available, signUpWithEmail creates user and updates profile when displayName provided", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    const mockUser = { uid: "1" };
    vi.mocked(getAuthInstance).mockReturnValue(mockAuth);
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser as never,
    } as never);
    vi.mocked(updateProfile).mockResolvedValue(undefined as never);
    await service.signUpWithEmail("a@b.com", "pass", "Alice");
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      "a@b.com",
      "pass",
    );
    expect(updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: "Alice",
    });
  });

  it("when auth is available, signUpWithEmail does not call updateProfile when displayName is empty", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    const mockUser = {};
    vi.mocked(getAuthInstance).mockReturnValue(mockAuth);
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser as never,
    } as never);
    await service.signUpWithEmail("a@b.com", "pass");
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("when auth is available, sendPasswordReset calls sendPasswordResetEmail", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    vi.mocked(getAuthInstance).mockReturnValue(mockAuth);
    vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined as never);
    await service.sendPasswordReset("a@b.com");
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockAuth, "a@b.com");
  });

  it("when auth is available, signOut calls firebase signOut", async () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    vi.mocked(getAuthInstance).mockReturnValue(mockAuth);
    vi.mocked(signOut).mockResolvedValue(undefined as never);
    await service.signOut();
    expect(signOut).toHaveBeenCalledWith(mockAuth);
  });

  it("when auth is available, subscribeToAuthState returns unsubscribe from onAuthStateChanged", () => {
    const mockAuth = {} as import("firebase/auth").Auth;
    vi.mocked(getAuthInstance).mockReturnValue(mockAuth);
    vi.mocked(onAuthStateChanged).mockReturnValue(mockUnsubscribe);
    const callback = vi.fn();
    const unsubscribe = service.subscribeToAuthState(callback);
    expect(onAuthStateChanged).toHaveBeenCalledWith(
      mockAuth,
      expect.any(Function),
    );
    unsubscribe();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
