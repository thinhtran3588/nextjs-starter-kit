import { AuthPageContent } from "@/modules/auth/components/auth-page-content";
import { getTranslations } from "next-intl/server";

export async function ForgotPasswordPage() {
  const tForgotPassword = await getTranslations(
    "modules.auth.pages.forgot-password",
  );
  const tCommon = await getTranslations("common");

  return (
    <AuthPageContent
      title={tForgotPassword("title")}
      ctaLabel={tCommon("navigation.backToHome")}
    />
  );
}
