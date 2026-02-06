import { getTranslations } from "next-intl/server";

import { TermsOfServicePage } from "@/modules/landing-page/presentation/pages/terms-of-service/page";

export async function generateMetadata() {
  const t = await getTranslations("modules.legal.pages.terms-of-service");

  return {
    title: t("title"),
    description: t("metadata.description"),
  };
}

export default function Page() {
  return <TermsOfServicePage />;
}
