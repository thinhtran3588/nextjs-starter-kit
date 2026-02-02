import type { MenuItem, ResolvedMenuItem } from "@/common/interfaces/menu-item";
import { getMainMenuConfig } from "@/application/config/main-menu";
import { routing } from "@/common/routing/routing";
import { getLocale, getTranslations } from "next-intl/server";
import { MainHeader } from "@/common/components/main-header";

type MainLayoutProps = {
  children: React.ReactNode;
};

function resolveMenuItems(
  items: MenuItem[],
  t: (key: string) => string,
): ResolvedMenuItem[] {
  return items.map((item) => ({
    id: item.id,
    label: t(item.translationKey),
    href: item.href,
    children: item.children?.length
      ? resolveMenuItems(item.children, t)
      : undefined,
  }));
}

export async function MainLayout({ children }: MainLayoutProps) {
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("modules.landing.pages.home");
  const locale = await getLocale();

  const menuConfig = getMainMenuConfig();
  const menuItems = resolveMenuItems(menuConfig, (key) => tCommon(key));

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="glow-orb float left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[rgba(139,184,255,0.45)]" />
      <div className="glow-orb float right-[-15%] top-[10%] h-[380px] w-[380px] bg-[rgba(126,249,216,0.35)]" />
      <div className="glow-orb float bottom-[-20%] left-[20%] h-[460px] w-[460px] bg-[rgba(139,184,255,0.2)]" />

      <MainHeader
        badge={tHome("badge")}
        menuItems={menuItems}
        signInLabel={tCommon("navigation.signIn")}
        profileLabel={tCommon("navigation.profile")}
        signOutLabel={tCommon("navigation.signOut")}
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
