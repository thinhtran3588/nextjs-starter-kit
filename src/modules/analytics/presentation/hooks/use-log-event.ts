"use client";

import { useContainer } from "@/common/hooks/use-container";
import type { LogEventUseCase } from "@/modules/analytics/application/log-event-use-case";

export function useLogEvent() {
  const container = useContainer();

  const logEvent = (eventName: string, params?: Record<string, unknown>) => {
    const logEventUseCase = container.resolve(
      "logEventUseCase",
    ) as LogEventUseCase;
    logEventUseCase.execute({ eventName, params });
  };

  return { logEvent };
}
