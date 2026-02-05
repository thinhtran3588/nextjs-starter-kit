"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/common/components/button";
import { ButtonGroup } from "@/common/components/button-group";
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
  PencilIcon,
  UserIcon,
} from "@/common/components/icons";
import { Input } from "@/common/components/input";
import { useContainer } from "@/common/hooks/use-container";
import type { UpdateProfileUseCase } from "@/modules/auth/application/update-profile-use-case";
import {
  getProfileSchema,
  type ProfileInput,
} from "@/modules/auth/domain/schemas";
import { AuthType, type AuthErrorCode } from "@/modules/auth/domain/types";
import { useAuthUserStore } from "@/modules/auth/presentation/hooks/use-auth-user-store";
import { ChangePasswordModal } from "./change-password-modal";

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

  const [editing, setEditing] = useState(false);
  const [profileErrorCode, setProfileErrorCode] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const profileSchema = useMemo(
    () => getProfileSchema((key) => t(`validation.${key}`)),
    [t],
  );

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName ?? undefined,
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
        className="h-32 animate-pulse rounded-lg bg-[var(--glass-highlight)]"
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
      setEditing(false);
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
      setEditing(false);
      return;
    }
    setProfileErrorCode(result.error);
  }

  function handleCancel() {
    profileForm.reset({ displayName: user?.displayName ?? "" });
    setProfileErrorCode(null);
    setEditing(false);
  }

  const AuthIcon = AUTH_TYPE_ICON[user.authType] ?? UserIcon;
  const profileErrorMessage =
    profileErrorCode !== null
      ? t(`errors.${ERROR_KEY_MAP[profileErrorCode as AuthErrorCode]}`)
      : null;

  return (
    <div className="space-y-6 text-left">
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
                  {editing ? (
                    <>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("fullNameLabel")}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </>
                  ) : (
                    <p className="text-[var(--text-primary)]">
                      {field.value || "—"}
                    </p>
                  )}
                </FormItem>
              )}
            />
            {profileErrorMessage ? (
              <p className="text-sm text-red-500" role="alert">
                {profileErrorMessage}
              </p>
            ) : null}
          </form>
        </Form>
      </div>

      <ButtonGroup>
        {editing ? (
          <>
            <Button
              type="submit"
              variant="primary"
              loading={profileForm.formState.isSubmitting}
              onClick={profileForm.handleSubmit(onProfileSubmit)}
            >
              {t("saveButton")}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              {t("cancelButton")}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="primary"
            onClick={() => setEditing(true)}
          >
            <PencilIcon className="size-4" />
            {t("editButton")}
          </Button>
        )}
        {user.authType === AuthType.Email ? (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPasswordModalOpen(true)}
            >
              {t("changePasswordButton")}
            </Button>
            <ChangePasswordModal
              open={passwordModalOpen}
              onOpenChange={setPasswordModalOpen}
              onSuccess={() => toast.success(t("passwordSuccessMessage"))}
            />
          </>
        ) : null}
      </ButtonGroup>
    </div>
  );
}
