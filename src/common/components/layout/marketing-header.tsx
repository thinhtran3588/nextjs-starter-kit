"use client";

import { Link } from "@/application/routing/navigation";
import type { LocaleOption } from "@/common/components/layout/language-selector";
import { LanguageSelector } from "@/common/components/layout/language-selector";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
          ? "-translate-y-full opacity-0 pointer-events-none"
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
            <LanguageSelector
              languageLabel={languageLabel}
              currentLocale={currentLocale}
              localeOptions={localeOptions}
            />
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
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen ? (
          <div
            className="glass-panel-strong absolute left-6 right-6 top-full z-40 rounded-3xl px-4 py-4 text-sm text-white sm:hidden"
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
