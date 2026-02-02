import type { AwilixContainer } from "awilix";
import { createContainer, setContainer } from "@/common/utils/container";
import { registerModule as registerAuthModule } from "@/modules/auth/module-configuration";
import { registerModule as registerDocsModule } from "@/modules/docs/module-configuration";
import { registerModule as registerLandingPageModule } from "@/modules/landing-page/module-configuration";
import { registerModule as registerLegalModule } from "@/modules/legal/module-configuration";
import { registerModule as registerMainModule } from "@/modules/main/module-configuration";

export function registerContainer(container: AwilixContainer<object>): void {
  registerAuthModule(container);
  registerDocsModule(container);
  registerLandingPageModule(container);
  registerLegalModule(container);
  registerMainModule(container);
}

export function initializeContainer(): void {
  const container = createContainer();
  registerContainer(container);
  setContainer(container);
}
