"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/common/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/form";
import {
  AppleIcon,
  GoogleIcon,
  MailIcon,
  UserIcon,
} from "@/common/components/icons";
import { Input } from "@/common/components/input";
import { useContainer } from "@/common/hooks/use-container";
import {
  getProfileSchema,
  getUpdatePasswordSchema,
  type ProfileInput,
  type UpdatePasswordInput,
} from "@/modules/auth/domain/schemas";
import { AuthType, type AuthErrorCode } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import type { UpdatePasswordUseCase } from "@/modules/auth/use-cases/update-password-use-case";
import type { UpdateProfileUseCase } from "@/modules/auth/use-cases/update-profile-use-case";

const AUTH_TYPE_ICON: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  [AuthType.Email]: MailIcon,
  [AuthType.Google]: GoogleIcon,
  [AuthType.Apple]: AppleIcon,
  [AuthType.Other]: UserIcon,
};

const ERROR_KEY_MAP: Record<AuthErrorCode, string> = {
  "invalid-credentials": "invalidCredentials",
  "too-many-requests": "tooManyRequests",
  "email-already-in-use": "emailAlreadyInUse",
  generic: "generic",
};

export function ProfileForm() {
  const t = useTranslations("modules.auth.pages.profile");
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const loading = useAuthUserStore((s) => s.loading);
  const setAuthState = useAuthUserStore((s) => s.setAuthState);

  const [profileErrorCode, setProfileErrorCode] = useState<string | null>(null);
  const [passwordErrorCode, setPasswordErrorCode] = useState<string | null>(
    null,
  );
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const profileSchema = useMemo(
    () => getProfileSchema((key) => t(`validation.${key}`)),
    [t],
  );
  const updatePasswordSchema = useMemo(
    () => getUpdatePasswordSchema((key) => t(`validation.${key}`)),
    [t],
  );

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName ?? undefined,
    },
  });

  const passwordForm = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user?.displayName !== undefined) {
      profileForm.reset({ displayName: user.displayName ?? "" });
    }
  }, [user?.displayName, profileForm]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div
        className="h-32 animate-pulse rounded-lg bg-white/5"
        aria-busy="true"
        data-testid="profile-loading"
      />
    );
  }

  async function onProfileSubmit(values: ProfileInput) {
    setProfileErrorCode(null);
    if (
      values.displayName === undefined ||
      values.displayName === user?.displayName
    ) {
      return;
    }
    const useCase = container.resolve(
      "updateProfileUseCase",
    ) as UpdateProfileUseCase;
    const result = await useCase.execute({
      displayName: values.displayName.trim(),
    });
    if (result.success) {
      toast.success(t("successMessage"));
      const newDisplayName = values.displayName.trim();
      if (user) {
        setAuthState({ ...user, displayName: newDisplayName }, false);
      }
      return;
    }
    setProfileErrorCode(result.error);
  }

  async function onPasswordSubmit(values: UpdatePasswordInput) {
    setPasswordErrorCode(null);
    const useCase = container.resolve(
      "updatePasswordUseCase",
    ) as UpdatePasswordUseCase;
    const result = await useCase.execute({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
    if (result.success) {
      passwordForm.reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordModalOpen(false);
      toast.success(t("passwordSuccessMessage"));
      return;
    }
    setPasswordErrorCode(result.error);
  }

  const AuthIcon = AUTH_TYPE_ICON[user.authType] ?? UserIcon;
  const profileErrorMessage =
    profileErrorCode !== null
      ? t(`errors.${ERROR_KEY_MAP[profileErrorCode as AuthErrorCode]}`)
      : null;
  const passwordErrorMessage =
    passwordErrorCode !== null
      ? t(`errors.${ERROR_KEY_MAP[passwordErrorCode as AuthErrorCode]}`)
      : null;

  return (
    <div className="space-y-8 text-left">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-[var(--text-muted)]">
            {t("emailLabel")}
          </p>
          <p className="mt-1 flex items-center gap-2 text-[var(--text-primary)]">
            <span className="min-w-0 truncate">{user.email ?? "—"}</span>
            <span data-testid="profile-email-auth-icon" aria-hidden>
              <AuthIcon className="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
            </span>
          </p>
        </div>

        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-4"
          >
            <FormField
              control={profileForm.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullNameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("fullNameLabel")}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {profileErrorMessage ? (
              <p className="text-sm text-red-500" role="alert">
                {profileErrorMessage}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              {user.authType === AuthType.Email ? (
                <Dialog
                  open={passwordModalOpen}
                  onOpenChange={(open) => {
                    setPasswordModalOpen(open);
                    if (!open) {
                      setPasswordErrorCode(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="secondary">
                      {t("changePasswordButton")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby={undefined}>
                    <DialogHeader>
                      <DialogTitle>{t("passwordSectionTitle")}</DialogTitle>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form
                        onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={passwordForm.control}
                          name="oldPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("oldPasswordLabel")}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("newPasswordLabel")}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {passwordErrorMessage ? (
                          <p className="text-sm text-red-500" role="alert">
                            {passwordErrorMessage}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap items-center gap-2">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              {t("cancelButton")}
                            </Button>
                          </DialogClose>
                          <Button
                            type="submit"
                            variant="default"
                            loading={passwordForm.formState.isSubmitting}
                          >
                            {t("updatePasswordButton")}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              ) : null}
              <Button
                type="submit"
                variant="default"
                loading={profileForm.formState.isSubmitting}
              >
                {t("saveButton")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
