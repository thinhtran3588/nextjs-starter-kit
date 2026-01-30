import { SimplePage } from "@/common/components/layout/simple-page";
import { getTranslations } from "next-intl/server";

export async function PrivacyPolicyPage() {
  const tCommon = await getTranslations("common");
  const tPrivacyPolicy = await getTranslations(
    "modules.legal.pages.privacy-policy",
  );

  return (
    <SimplePage
      title={tPrivacyPolicy("title")}
      ctaLabel={tCommon("navigation.backToHome")}
    />
  );
}
