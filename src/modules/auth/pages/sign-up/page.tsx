import { AuthPageContent } from "@/modules/auth/components/auth-page-content";
import { getTranslations } from "next-intl/server";

export async function SignUpPage() {
  const tSignUp = await getTranslations("modules.auth.pages.sign-up");
  const tCommon = await getTranslations("common");

  return (
    <AuthPageContent
      title={tSignUp("title")}
      ctaLabel={tCommon("navigation.backToHome")}
    />
  );
}
