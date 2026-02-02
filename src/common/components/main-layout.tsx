import { getLocale, getTranslations } from "next-intl/server";

import { MainHeader } from "@/common/components/main-header";
import type { ResolvedMenuItem } from "@/common/interfaces/menu-item";
import { routing } from "@/common/routing/routing";

type MainLayoutProps = {
  children: React.ReactNode;
  menuItems: ResolvedMenuItem[];
  authSlot?: React.ReactNode;
};

export async function MainLayout({
  children,
  menuItems,
  authSlot,
}: MainLayoutProps) {
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("modules.landing.pages.home");
  const locale = await getLocale();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="glow-orb float top-[-10%] left-[-10%] h-[420px] w-[420px] bg-[rgba(139,184,255,0.45)]" />
      <div className="glow-orb float top-[10%] right-[-15%] h-[380px] w-[380px] bg-[rgba(126,249,216,0.35)]" />
      <div className="glow-orb float bottom-[-20%] left-[20%] h-[460px] w-[460px] bg-[rgba(139,184,255,0.2)]" />

      <MainHeader
        badge={tHome("badge")}
        menuItems={menuItems}
        languageLabel={tCommon("language.label")}
        menuLabel={tCommon("navigation.menu")}
        currentLocale={locale}
        localeOptions={routing.locales.map((targetLocale) => ({
          locale: targetLocale,
          label: tCommon(`language.options.${targetLocale}`),
          flag: tCommon(`language.flags.${targetLocale}`),
        }))}
        authSlot={authSlot}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pt-28 pb-24 sm:pt-24">
        {children}
      </main>
    </div>
  );
}
