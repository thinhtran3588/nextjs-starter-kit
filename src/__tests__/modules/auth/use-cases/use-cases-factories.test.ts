import { describe, expect, it, vi } from "vitest";

import type { BaseAuthenticationService } from "@/modules/auth/interfaces/base-authentication-service";
import { GetAuthStateSubscriptionUseCase } from "@/modules/auth/use-cases/get-auth-state-subscription-use-case";
import { SendPasswordResetUseCase } from "@/modules/auth/use-cases/send-password-reset-use-case";
import { SignInWithEmailUseCase } from "@/modules/auth/use-cases/sign-in-with-email-use-case";
import { SignInWithGoogleUseCase } from "@/modules/auth/use-cases/sign-in-with-google-use-case";
import { SignOutUseCase } from "@/modules/auth/use-cases/sign-out-use-case";
import { SignUpWithEmailUseCase } from "@/modules/auth/use-cases/sign-up-with-email-use-case";
import { UpdatePasswordUseCase } from "@/modules/auth/use-cases/update-password-use-case";
import { UpdateProfileUseCase } from "@/modules/auth/use-cases/update-profile-use-case";

function createMockAuthService(): BaseAuthenticationService {
  return {
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
    sendPasswordReset: vi.fn(),
    signOut: vi.fn(),
    subscribeToAuthState: vi.fn(() => () => {}),
    updateDisplayName: vi.fn().mockResolvedValue({ success: true }),
    updatePassword: vi.fn().mockResolvedValue({ success: true }),
  };
}

describe("auth use case classes", () => {
  describe("SignInWithGoogleUseCase", () => {
    it("execute returns success when authService succeeds", async () => {
      const mock = createMockAuthService();
      const useCase = new SignInWithGoogleUseCase(mock);
      const result = await useCase.execute({});
      expect(result).toEqual({ success: true });
      expect(mock.signInWithGoogle).toHaveBeenCalledOnce();
    });

    it("execute returns error code when authService throws", async () => {
      const mock = createMockAuthService();
      vi.mocked(mock.signInWithGoogle).mockRejectedValueOnce(
        new Error("fail") as Error & { code?: string },
      );
      const useCase = new SignInWithGoogleUseCase(mock);
      const result = await useCase.execute({});
      expect(result).toEqual({ success: false, error: "generic" });
    });

    it("execute maps invalid-credential code", async () => {
      const mock = createMockAuthService();
      vi.mocked(mock.signInWithGoogle).mockRejectedValueOnce({
        code: "auth/invalid-credential",
      });
      const useCase = new SignInWithGoogleUseCase(mock);
      const result = await useCase.execute({});
      expect(result).toEqual({
        success: false,
        error: "invalid-credentials",
      });
    });

    it("execute maps too-many-requests code", async () => {
      const mock = createMockAuthService();
      vi.mocked(mock.signInWithGoogle).mockRejectedValueOnce({
        code: "auth/too-many-requests",
      });
      const useCase = new SignInWithGoogleUseCase(mock);
      const result = await useCase.execute({});
      expect(result).toEqual({
        success: false,
        error: "too-many-requests",
      });
    });
  });

  describe("SignInWithEmailUseCase", () => {
    it("execute returns success and calls authService with email and password", async () => {
      const mock = createMockAuthService();
      const useCase = new SignInWithEmailUseCase(mock);
      const result = await useCase.execute({
        email: "a@b.com",
        password: "secret",
      });
      expect(result).toEqual({ success: true });
      expect(mock.signInWithEmail).toHaveBeenCalledWith("a@b.com", "secret");
    });

    it("execute returns error when authService throws", async () => {
      const mock = createMockAuthService();
      vi.mocked(mock.signInWithEmail).mockRejectedValueOnce({ code: "x" });
      const useCase = new SignInWithEmailUseCase(mock);
      const result = await useCase.execute({
        email: "a@b.com",
        password: "pass",
      });
      expect(result).toEqual({ success: false, error: "generic" });
    });
  });

  describe("SignUpWithEmailUseCase", () => {
    it("execute returns success and calls authService with email, password, displayName", async () => {
      const mock = createMockAuthService();
      const useCase = new SignUpWithEmailUseCase(mock);
      const result = await useCase.execute({
        email: "a@b.com",
        password: "secret",
        displayName: "Alice",
      });
      expect(result).toEqual({ success: true });
      expect(mock.signUpWithEmail).toHaveBeenCalledWith(
        "a@b.com",
        "secret",
        "Alice",
      );
    });

    it("execute maps email-already-in-use", async () => {
      const mock = createMockAuthService();
      vi.mocked(mock.signUpWithEmail).mockRejectedValueOnce({
        code: "auth/email-already-in-use",
      });
      const useCase = new SignUpWithEmailUseCase(mock);
      const result = await useCase.execute({
        email: "a@b.com",
        password: "pass",
      });
      expect(result).toEqual({
        success: false,
        error: "email-already-in-use",
      });
    });
  });

  describe("SendPasswordResetUseCase", () => {
    it("execute returns success when authService succeeds", async () => {
      const mock = createMockAuthService();
      const useCase = new SendPasswordResetUseCase(mock);
      const result = await useCase.execute({ email: "a@b.com" });
      expect(result).toEqual({ success: true });
      expect(mock.sendPasswordReset).toHaveBeenCalledWith("a@b.com");
    });

    it("execute returns generic error when authService throws", async () => {
      const mock = createMockAuthService();
      vi.mocked(mock.sendPasswordReset).mockRejectedValueOnce(new Error());
      const useCase = new SendPasswordResetUseCase(mock);
      const result = await useCase.execute({ email: "a@b.com" });
      expect(result).toEqual({ success: false, error: "generic" });
    });
  });

  describe("SignOutUseCase", () => {
    it("execute returns success when authService succeeds", async () => {
      const mock = createMockAuthService();
      const useCase = new SignOutUseCase(mock);
      const result = await useCase.execute({});
      expect(result).toEqual({ success: true });
      expect(mock.signOut).toHaveBeenCalledOnce();
    });

    it("execute returns generic error when authService throws", async () => {
      const mock = createMockAuthService();
      vi.mocked(mock.signOut).mockRejectedValueOnce(new Error());
      const useCase = new SignOutUseCase(mock);
      const result = await useCase.execute({});
      expect(result).toEqual({ success: false, error: "generic" });
    });
  });

  describe("GetAuthStateSubscriptionUseCase", () => {
    it("execute returns subscription that delegates to authService.subscribeToAuthState", () => {
      const mock = createMockAuthService();
      const useCase = new GetAuthStateSubscriptionUseCase(mock);
      const subscription = useCase.execute({});
      const callback = vi.fn();
      const unsubscribe = subscription.subscribe(callback);
      expect(mock.subscribeToAuthState).toHaveBeenCalledWith(callback);
      expect(typeof unsubscribe).toBe("function");
    });
  });

  describe("UpdateProfileUseCase", () => {
    it("execute calls authService.updateDisplayName and returns result", async () => {
      const mock = createMockAuthService();
      const useCase = new UpdateProfileUseCase(mock);
      const result = await useCase.execute({ displayName: "Alice" });
      expect(result).toEqual({ success: true });
      expect(mock.updateDisplayName).toHaveBeenCalledWith("Alice");
    });
  });

  describe("UpdatePasswordUseCase", () => {
    it("execute calls authService.updatePassword and returns result", async () => {
      const mock = createMockAuthService();
      const useCase = new UpdatePasswordUseCase(mock);
      const result = await useCase.execute({
        oldPassword: "old",
        newPassword: "new",
      });
      expect(result).toEqual({ success: true });
      expect(mock.updatePassword).toHaveBeenCalledWith("old", "new");
    });
  });
});
