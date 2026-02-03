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

  const themeOptions = [
    { theme: "system" as const, label: tCommon("theme.options.system") },
    { theme: "light" as const, label: tCommon("theme.options.light") },
    { theme: "dark" as const, label: tCommon("theme.options.dark") },
  ];

  return (
    <div className="blueprint-grid relative min-h-screen overflow-hidden">
      <div
        className="glow-orb top-[-10%] left-[-10%] h-[420px] w-[420px] bg-[var(--orb-1)]"
        aria-hidden
      />
      <div
        className="glow-orb glow-orb-2 top-[10%] right-[-15%] h-[380px] w-[380px] bg-[var(--orb-2)]"
        aria-hidden
      />
      <div
        className="glow-orb glow-orb-3 bottom-[-20%] left-[20%] h-[460px] w-[460px] bg-[var(--orb-3)]"
        aria-hidden
      />

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
        themeLabel={tCommon("theme.label")}
        themeOptions={themeOptions}
        authSlot={authSlot}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pt-28 pb-24 sm:pt-24">
        {children}
      </main>
    </div>
  );
}
