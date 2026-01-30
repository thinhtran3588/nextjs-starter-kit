import { AuthPageContent } from "@/modules/auth/components/auth-page-content";
import { getTranslations } from "next-intl/server";

export async function SignInPage() {
  const tSignIn = await getTranslations("modules.auth.pages.sign-in");
  const tCommon = await getTranslations("common");

  return (
    <AuthPageContent
      title={tSignIn("title")}
      ctaLabel={tCommon("navigation.backToHome")}
    />
  );
}
