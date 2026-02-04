"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/common/components/button";
import { ChevronDownIcon } from "@/common/components/icons";
import { Link, usePathname } from "@/common/routing/navigation";
import { routing } from "@/common/routing/routing";
import { useUserSettings } from "@/modules/settings/hooks/use-user-settings-store";

export function LanguageSelector() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const { persistLocale } = useUserSettings();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languageLabel = t("language.label");
  const localeOptions = routing.locales.map((targetLocale) => ({
    locale: targetLocale,
    label: t(`language.options.${targetLocale}`),
    flag: t(`language.flags.${targetLocale}`),
  }));

  const currentLocaleOption = localeOptions.find(
    (option) => option.locale === locale,
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2 px-2 sm:px-3"
        aria-label={`${languageLabel}: ${currentLocaleOption?.label ?? ""}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-sm">{currentLocaleOption?.flag}</span>
        <span className="hidden sm:inline">{currentLocaleOption?.label}</span>
        <ChevronDownIcon className="h-3 w-3" />
      </Button>
      {isOpen ? (
        <div
          className="glass-dropdown pointer-events-auto absolute right-0 z-40 mt-2 flex w-44 flex-col gap-1 rounded-2xl px-2 py-2 text-xs [color:var(--text-primary)]"
          role="listbox"
          aria-label={languageLabel}
        >
          {localeOptions.map((option) => {
            const isActive = option.locale === locale;

            return (
              <Link
                key={option.locale}
                href={pathname}
                locale={option.locale}
                role="option"
                aria-selected={isActive}
                className={`flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition hover:bg-[var(--glass-highlight)] ${
                  isActive
                    ? "bg-[var(--glass-highlight)] text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                }`}
                onClick={() => {
                  persistLocale(option.locale);
                  setIsOpen(false);
                }}
              >
                <span className="text-sm">{option.flag}</span>
                <span>{option.label}</span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
