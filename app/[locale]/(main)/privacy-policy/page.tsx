import { getTranslations } from "next-intl/server";

import { PrivacyPolicyPage } from "@/modules/landing-page/presentation/pages/privacy-policy/page";

export async function generateMetadata() {
  const t = await getTranslations("modules.legal.pages.privacy-policy");

  return {
    title: t("title"),
    description: t("metadata.description"),
  };
}

export default function Page() {
  return <PrivacyPolicyPage />;
}
