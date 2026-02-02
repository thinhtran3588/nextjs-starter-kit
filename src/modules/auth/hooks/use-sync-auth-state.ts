"use client";

import { useEffect } from "react";
import { useContainer } from "@/common/hooks/use-container";
import { useAuthUserStore } from "@/modules/auth/hooks/use-auth-user-store";
import type { GetAuthStateSubscriptionUseCase } from "@/modules/auth/use-cases/get-auth-state-subscription-use-case";

export function useSyncAuthState(): void {
  const container = useContainer();
  const setAuthState = useAuthUserStore((s) => s.setAuthState);

  useEffect(() => {
    const useCase = container.resolve(
      "getAuthStateSubscriptionUseCase",
    ) as GetAuthStateSubscriptionUseCase;
    const subscription = useCase.execute({});
    const unsubscribe = subscription.subscribe((nextUser) => {
      setAuthState(nextUser, false);
    });
    return () => unsubscribe();
  }, [container, setAuthState]);
}
