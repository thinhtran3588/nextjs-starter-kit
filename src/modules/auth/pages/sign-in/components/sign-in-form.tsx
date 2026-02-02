"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/common/routing/navigation";
import { Link } from "@/common/routing/navigation";
import { Button } from "@/common/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/form";
import { Input } from "@/common/components/input";
import { useContainer } from "@/common/hooks/use-container";
import type { AuthErrorCode } from "@/modules/auth/domain/types";
import {
  getSignInSchema,
  type SignInInput,
} from "@/modules/auth/domain/schemas";
import type { SignInWithEmailUseCase } from "@/modules/auth/use-cases/sign-in-with-email-use-case";
import type { SignInWithGoogleUseCase } from "@/modules/auth/use-cases/sign-in-with-google-use-case";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const ERROR_KEY_MAP: Record<AuthErrorCode, string> = {
  "invalid-credentials": "invalidCredentials",
  "too-many-requests": "tooManyRequests",
  "email-already-in-use": "emailAlreadyInUse",
  generic: "generic",
};

export function SignInForm() {
  const t = useTranslations("modules.auth.pages.sign-in");
  const tCommon = useTranslations("common.navigation");
  const router = useRouter();
  const container = useContainer();
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signInSchema = useMemo(
    () => getSignInSchema((key) => t(`validation.${key}`)),
    [t],
  );

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onGoogleSignIn() {
    setGoogleLoading(true);
    setErrorCode(null);
    const useCase = container.resolve(
      "signInWithGoogleUseCase",
    ) as SignInWithGoogleUseCase;
    const result = await useCase.execute({});
    setGoogleLoading(false);
    if (result.success) {
      router.replace("/");
      return;
    }
    setErrorCode(result.error);
  }

  async function onSubmit(values: SignInInput) {
    setErrorCode(null);
    const useCase = container.resolve(
      "signInWithEmailUseCase",
    ) as SignInWithEmailUseCase;
    const result = await useCase.execute({
      email: values.email,
      password: values.password,
    });
    if (result.success) {
      router.replace("/");
      return;
    }
    setErrorCode(result.error);
  }

  const errorMessage =
    errorCode !== null
      ? t(`errors.${ERROR_KEY_MAP[errorCode as AuthErrorCode]}`)
      : null;

  return (
    <div className="space-y-6 text-left">
      <p className="text-center text-sm text-[var(--text-muted)]">
        {t.rich("agreeToPolicyAndTerms", {
          privacy: (
            <Link
              key="privacy"
              href="/privacy-policy"
              className="text-[var(--accent)] hover:underline"
            >
              {tCommon("privacy")}
            </Link>
          ) as unknown as string,
          terms: (
            <Link
              key="terms"
              href="/terms-of-service"
              className="text-[var(--accent)] hover:underline"
            >
              {tCommon("terms")}
            </Link>
          ) as unknown as string,
        })}
      </p>
      <Button
        type="button"
        variant="default"
        size="lg"
        className="w-full"
        onClick={onGoogleSignIn}
        loading={googleLoading}
      >
        <GoogleIcon className="size-5 shrink-0" />
        {t("googleButton")}
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--glass-border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-[var(--text-muted)]">
            {t("or")}
          </span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("emailLabel")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-3">
            {errorMessage ? (
              <p className="text-sm text-red-500" role="alert">
                {errorMessage}
              </p>
            ) : null}
            <Button
              type="submit"
              variant="default"
              className="w-full"
              loading={form.formState.isSubmitting}
            >
              <MailIcon className="size-5 shrink-0" />
              {t("submitButton")}
            </Button>
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                {t("forgotPasswordLink")}
              </Link>
            </div>
          </div>
        </form>
      </Form>
      <p className="text-center text-sm text-[var(--text-muted)]">
        {t("noAccountPrompt")}{" "}
        <Link
          href="/auth/sign-up"
          className="text-[var(--accent)] hover:underline"
        >
          {t("signUpLink")}
        </Link>
      </p>
    </div>
  );
}
