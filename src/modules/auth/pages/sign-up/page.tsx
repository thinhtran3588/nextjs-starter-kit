import { Link } from "@/application/routing/navigation";
import { Button } from "@/common/components/ui/button";
import { getTranslations } from "next-intl/server";

export async function SignUpPage() {
  const tSignUp = await getTranslations("modules.auth.pages.sign-up");
  const tCommon = await getTranslations("common");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white sm:text-4xl">
        {tSignUp("title")}
      </h1>
      <Button asChild variant="default">
        <Link href="/">{tCommon("navigation.backToHome")}</Link>
      </Button>
    </div>
  );
}
