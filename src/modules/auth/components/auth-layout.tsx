import { getLocale, getTranslations } from "next-intl/server";
import { routing } from "@/common/routing/routing";
import { BackToHomeButton } from "@/common/components/back-to-home-button";
import { LanguageSelector } from "@/common/components/language-selector";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export async function AuthLayout({ children }: AuthLayoutProps) {
  const tCommon = await getTranslations("common");
  const locale = await getLocale();

  const localeOptions = routing.locales.map((targetLocale) => ({
    locale: targetLocale,
    label: tCommon(`language.options.${targetLocale}`),
    flag: tCommon(`language.flags.${targetLocale}`),
  }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="glow-orb float left-[-15%] top-[15%] h-[360px] w-[360px] bg-[rgba(139,184,255,0.35)]" />
      <div className="glow-orb float right-[-20%] bottom-[10%] h-[420px] w-[420px] bg-[rgba(126,249,216,0.28)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-16">
        <main
          className="auth-center-area glass-panel-strong relative w-full max-w-xl rounded-3xl px-8 pt-4 pb-6 text-center"
          data-testid="auth-center-area"
        >
          <div className="absolute right-4 top-4">
            <LanguageSelector
              languageLabel={tCommon("language.label")}
              currentLocale={locale}
              localeOptions={localeOptions}
            />
          </div>
          {children}
          <div className="mt-6 flex justify-center">
            <BackToHomeButton />
          </div>
        </main>
      </div>
    </div>
  );
}
