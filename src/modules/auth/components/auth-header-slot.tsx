"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/common/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/dropdown-menu";
import { useContainer } from "@/common/hooks/use-container";
import { Link } from "@/common/routing/navigation";
import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import type { SignOutUseCase } from "@/modules/auth/use-cases/sign-out-use-case";

export function AuthHeaderSlot() {
  const t = useTranslations("common");
  const signInLabel = t("navigation.signIn");
  const profileLabel = t("navigation.profile");
  const signOutLabel = t("navigation.signOut");
  const container = useContainer();
  const user = useAuthUserStore((s) => s.user);
  const loading = useAuthUserStore((s) => s.loading);

  async function handleSignOut() {
    const useCase = container.resolve("signOutUseCase") as SignOutUseCase;
    await useCase.execute({});
  }

  if (loading) {
    return (
      <div
        className="h-8 w-16 animate-pulse rounded-full bg-[var(--glass-highlight)] sm:h-8 sm:w-16"
        aria-busy="true"
        data-testid="auth-loading"
      />
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="sm" className="w-full sm:w-auto">
            {user.displayName || user.email || signInLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 sm:w-auto">
          <DropdownMenuItem asChild>
            <Link href="/auth/profile">{profileLabel}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            {signOutLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild variant="default" size="sm">
      <Link href="/auth/sign-in">{signInLabel}</Link>
    </Button>
  );
}
