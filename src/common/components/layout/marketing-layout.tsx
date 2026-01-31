import { DOC_I18N_KEYS, DOC_SLUGS } from "@/common/config/docs";
import { routing } from "@/application/routing/routing";
import { getLocale, getTranslations } from "next-intl/server";
import { MarketingHeader } from "@/common/components/layout/marketing-header";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

export async function MarketingLayout({ children }: MarketingLayoutProps) {
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("modules.landing.pages.home");
  const locale = await getLocale();

  const docItems = DOC_SLUGS.map((slug) => ({
    label: tCommon(`navigation.docs.${DOC_I18N_KEYS[slug]}`),
    href: `/docs/${slug}`,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="glow-orb float left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[rgba(139,184,255,0.45)]" />
      <div className="glow-orb float right-[-15%] top-[10%] h-[380px] w-[380px] bg-[rgba(126,249,216,0.35)]" />
      <div className="glow-orb float bottom-[-20%] left-[20%] h-[460px] w-[460px] bg-[rgba(139,184,255,0.2)]" />

      <MarketingHeader
        badge={tHome("badge")}
        homeLabel={tCommon("navigation.home")}
        signInLabel={tCommon("navigation.signIn")}
        privacyLabel={tCommon("navigation.privacy")}
        termsLabel={tCommon("navigation.terms")}
        documentsLabel={tCommon("navigation.documents")}
        docItems={docItems}
        languageLabel={tCommon("language.label")}
        menuLabel={tCommon("navigation.menu")}
        currentLocale={locale}
        localeOptions={routing.locales.map((targetLocale) => ({
          locale: targetLocale,
          label: tCommon(`language.options.${targetLocale}`),
          flag: tCommon(`language.flags.${targetLocale}`),
        }))}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-28 sm:pt-24">
        {children}
      </main>
    </div>
  );
}
