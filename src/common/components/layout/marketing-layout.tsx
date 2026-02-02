import { getLocale, getTranslations } from "next-intl/server";

import { MarketingHeader } from "@/common/components/layout/marketing-header";
import { routing } from "@/common/routing/routing";

type MarketingLayoutProps = {
  children: React.ReactNode;
};

export async function MarketingLayout({ children }: MarketingLayoutProps) {
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("modules.landing.pages.home");
  const locale = await getLocale();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="glow-orb float top-[-10%] left-[-10%] h-[420px] w-[420px] bg-[rgba(139,184,255,0.45)]" />
      <div className="glow-orb float top-[10%] right-[-15%] h-[380px] w-[380px] bg-[rgba(126,249,216,0.35)]" />
      <div className="glow-orb float bottom-[-20%] left-[20%] h-[460px] w-[460px] bg-[rgba(139,184,255,0.2)]" />

      <MarketingHeader
        badge={tHome("badge")}
        homeLabel={tCommon("navigation.home")}
        signInLabel={tCommon("navigation.signIn")}
        privacyLabel={tCommon("navigation.privacy")}
        termsLabel={tCommon("navigation.terms")}
        languageLabel={tCommon("language.label")}
        menuLabel={tCommon("navigation.menu")}
        currentLocale={locale}
        localeOptions={routing.locales.map((targetLocale) => ({
          locale: targetLocale,
          label: tCommon(`language.options.${targetLocale}`),
          flag: tCommon(`language.flags.${targetLocale}`),
        }))}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pt-28 pb-24 sm:pt-24">
        {children}
      </main>
    </div>
  );
}
