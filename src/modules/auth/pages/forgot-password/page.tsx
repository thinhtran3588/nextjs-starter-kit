import { Link } from "@/application/routing/navigation";
import { Button } from "@/common/components/ui/button";
import { getTranslations } from "next-intl/server";

export async function ForgotPasswordPage() {
  const tForgotPassword = await getTranslations(
    "modules.auth.pages.forgot-password",
  );
  const tCommon = await getTranslations("common");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white sm:text-4xl">
        {tForgotPassword("title")}
      </h1>
      <Button asChild variant="default">
        <Link href="/">{tCommon("navigation.backToHome")}</Link>
      </Button>
    </div>
  );
}
