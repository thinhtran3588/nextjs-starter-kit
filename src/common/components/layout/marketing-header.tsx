"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ChevronDownIcon, MenuIcon } from "@/common/components/icons";
import { Link } from "@/common/routing/navigation";

type LocaleOption = {
  locale: string;
  label: string;
  flag: string;
};

type MarketingHeaderProps = {
  badge: string;
  homeLabel: string;
  signInLabel: string;
  privacyLabel: string;
  termsLabel: string;
  languageLabel: string;
  menuLabel: string;
  currentLocale: string;
  localeOptions: LocaleOption[];
};

const SCROLL_HIDE_THRESHOLD = 32;
const SCROLL_DELTA = 4;

export function MarketingHeader({
  badge,
  homeLabel,
  signInLabel,
  privacyLabel,
  termsLabel,
  languageLabel,
  menuLabel,
  currentLocale,
  localeOptions,
}: MarketingHeaderProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const currentLocaleOption = localeOptions.find(
    (option) => option.locale === currentLocale,
  );

  useEffect(() => {
    lastScrollY.current = window.scrollY;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < SCROLL_DELTA) {
        return;
      }

      if (currentScrollY <= SCROLL_HIDE_THRESHOLD) {
        setIsHidden(false);
      } else if (delta > 0) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[rgba(6,10,20,0.6)] backdrop-blur-sm transition-all duration-300 ${
        isHidden
          ? "pointer-events-none -translate-y-full opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div className="relative">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link
            className="flex items-center gap-3 text-base font-semibold text-white/90 transition hover:text-white"
            href="/"
          >
            <Image
              src="/icon.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 rounded-md"
              aria-hidden="true"
            />
            {badge}
          </Link>
          <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <nav className="hidden items-center gap-4 sm:flex">
              <Link className="transition hover:text-white" href="/">
                {homeLabel}
              </Link>
              <Link
                className="transition hover:text-white"
                href="/privacy-policy"
              >
                {privacyLabel}
              </Link>
              <Link
                className="transition hover:text-white"
                href="/terms-of-service"
              >
                {termsLabel}
              </Link>
            </nav>
            <details className="group relative">
              <summary
                className="glass-panel flex cursor-pointer list-none items-center gap-2 rounded-full px-2 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:text-white sm:px-3"
                aria-label={`${languageLabel}: ${currentLocaleOption?.label ?? ""}`}
              >
                <span className="text-sm">{currentLocaleOption?.flag}</span>
                <span className="hidden sm:inline">
                  {currentLocaleOption?.label}
                </span>
                <ChevronDownIcon className="h-3 w-3" />
              </summary>
              <div className="glass-panel-strong pointer-events-auto absolute right-0 z-40 mt-2 flex w-44 flex-col gap-1 rounded-2xl bg-[rgba(8,12,24,0.9)] px-2 py-2 text-xs text-white shadow-[0_20px_55px_rgba(0,0,0,0.45)] backdrop-blur">
                {localeOptions.map((option) => {
                  const isActive = option.locale === currentLocale;

                  return (
                    <Link
                      key={option.locale}
                      className={`flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition hover:bg-white/10 ${
                        isActive ? "bg-white/10 text-white" : "text-white/80"
                      }`}
                      href="/"
                      locale={option.locale}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span className="text-sm">{option.flag}</span>
                      <span>{option.label}</span>
                    </Link>
                  );
                })}
              </div>
            </details>
            <Link
              className="glass-panel hidden items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:translate-y-[-1px] sm:inline-flex"
              href="/auth/sign-in"
            >
              {signInLabel}
            </Link>
            <button
              className="glass-panel flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:scale-[1.02] sm:hidden"
              type="button"
              aria-label={menuLabel}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              <MenuIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        {isMenuOpen ? (
          <div
            className="glass-panel-strong absolute top-full right-6 left-6 z-40 rounded-3xl px-4 py-4 text-sm text-white sm:hidden"
            data-testid="mobile-menu"
          >
            <nav className="flex flex-col gap-3">
              <Link className="transition hover:text-white/80" href="/">
                {homeLabel}
              </Link>
              <Link
                className="glass-panel inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:translate-y-[-1px]"
                href="/auth/sign-in"
              >
                {signInLabel}
              </Link>
              <Link
                className="transition hover:text-white/80"
                href="/privacy-policy"
              >
                {privacyLabel}
              </Link>
              <Link
                className="transition hover:text-white/80"
                href="/terms-of-service"
              >
                {termsLabel}
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
