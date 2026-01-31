"use client";

import { Link, usePathname } from "@/application/routing/navigation";
import { useEffect, useRef, useState } from "react";

export type LocaleOption = {
  locale: string;
  label: string;
  flag: string;
};

type LanguageSelectorProps = {
  languageLabel: string;
  currentLocale: string;
  localeOptions: LocaleOption[];
};

export function LanguageSelector({
  languageLabel,
  currentLocale,
  localeOptions,
}: LanguageSelectorProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLocaleOption = localeOptions.find(
    (option) => option.locale === currentLocale,
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
      <button
        type="button"
        className="glass-panel flex cursor-pointer list-none items-center gap-2 rounded-full px-2 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:text-white sm:px-3"
        aria-label={`${languageLabel}: ${currentLocaleOption?.label ?? ""}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-sm">{currentLocaleOption?.flag}</span>
        <span className="hidden sm:inline">{currentLocaleOption?.label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7l5 5 5-5" />
        </svg>
      </button>
      {isOpen ? (
        <div
          className="glass-panel-strong pointer-events-auto absolute right-0 z-40 mt-2 flex w-44 flex-col gap-1 rounded-2xl bg-[rgba(8,12,24,0.9)] px-2 py-2 text-xs text-white shadow-[0_20px_55px_rgba(0,0,0,0.45)] backdrop-blur"
          role="listbox"
          aria-label={languageLabel}
        >
          {localeOptions.map((option) => {
            const isActive = option.locale === currentLocale;

            return (
              <Link
                key={option.locale}
                href={pathname}
                locale={option.locale}
                role="option"
                aria-selected={isActive}
                className={`flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition hover:bg-white/10 ${
                  isActive ? "bg-white/10 text-white" : "text-white/80"
                }`}
                onClick={() => setIsOpen(false)}
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
