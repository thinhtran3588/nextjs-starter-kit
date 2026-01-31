import { Link } from "@/application/routing/navigation";
import { Button } from "@/common/components/ui/button";
import { getTranslations } from "next-intl/server";

export async function TermsOfServicePage() {
  const tCommon = await getTranslations("common");
  const tTermsOfService = await getTranslations(
    "modules.legal.pages.terms-of-service",
  );

  return (
    <section className="glass-panel-strong liquid-border rounded-[32px] px-8 py-12 sm:px-14">
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
        {tTermsOfService("title")}
      </h1>
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        {tTermsOfService("lastUpdated")}
      </p>

      <div className="mt-10 space-y-10 text-[var(--text-muted)]">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.overview.title")}
          </h2>
          <p>{tTermsOfService("sections.overview.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.acceptance.title")}
          </h2>
          <p>{tTermsOfService("sections.acceptance.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.accounts.title")}
          </h2>
          <p>{tTermsOfService("sections.accounts.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.acceptableUse.title")}
          </h2>
          <p>{tTermsOfService("sections.acceptableUse.body")}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{tTermsOfService("sections.acceptableUse.items.unlawful")}</li>
            <li>{tTermsOfService("sections.acceptableUse.items.access")}</li>
            <li>
              {tTermsOfService("sections.acceptableUse.items.interference")}
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.thirdParty.title")}
          </h2>
          <p>{tTermsOfService("sections.thirdParty.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.starterKit.title")}
          </h2>
          <p>{tTermsOfService("sections.starterKit.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.termination.title")}
          </h2>
          <p>{tTermsOfService("sections.termination.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.disclaimers.title")}
          </h2>
          <p>{tTermsOfService("sections.disclaimers.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.liability.title")}
          </h2>
          <p>{tTermsOfService("sections.liability.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.changes.title")}
          </h2>
          <p>{tTermsOfService("sections.changes.body")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">
            {tTermsOfService("sections.contact.title")}
          </h2>
          <p>{tTermsOfService("sections.contact.body")}</p>
        </section>
      </div>

      <div className="mt-12">
        <Button asChild variant="default">
          <Link href="/">{tCommon("navigation.backToHome")}</Link>
        </Button>
      </div>
    </section>
  );
}
