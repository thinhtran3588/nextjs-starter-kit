"use client";

import { useEffect } from "react";

import { useContainer } from "@/common/hooks/use-container";
import type { SetAnalyticsUserUseCase } from "@/modules/analytics/application/set-analytics-user-use-case";

export function useSyncAnalyticsUser(): void {
  const container = useContainer();
  useEffect(() => {
    const setAnalyticsUserUseCase = container.resolve(
      "setAnalyticsUserUseCase",
    ) as SetAnalyticsUserUseCase;
    setAnalyticsUserUseCase.execute({ userId: null });
  }, [container]);
}
