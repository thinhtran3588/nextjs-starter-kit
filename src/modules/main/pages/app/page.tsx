import { SimplePage } from "@/common/components/layout/simple-page";
import { getTranslations } from "next-intl/server";

export async function AppPage() {
  const tCommon = await getTranslations("common");
  const tApp = await getTranslations("modules.main.pages.app");

  return (
    <SimplePage
      title={tApp("title")}
      ctaLabel={tCommon("navigation.backToHome")}
    />
  );
}
