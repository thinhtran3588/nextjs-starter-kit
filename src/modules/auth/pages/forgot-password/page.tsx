import { Link } from "@/application/routing/navigation";
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
      <Link
        className="glass-panel inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-2px]"
        href="/"
      >
        {tCommon("navigation.backToHome")}
      </Link>
    </div>
  );
}
