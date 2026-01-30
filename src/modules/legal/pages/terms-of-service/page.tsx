import { SimplePage } from "@/common/components/layout/simple-page";
import { getTranslations } from "next-intl/server";

export async function TermsOfServicePage() {
  const tCommon = await getTranslations("common");
  const tTermsOfService = await getTranslations(
    "modules.legal.pages.terms-of-service",
  );

  return (
    <SimplePage
      title={tTermsOfService("title")}
      ctaLabel={tCommon("navigation.backToHome")}
    />
  );
}
