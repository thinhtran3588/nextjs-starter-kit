"use client";

import { Link, usePathname } from "@/application/routing/navigation";
import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/utils/cn";
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
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" || pathname === "" : pathname === path;

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
              <Link
                className={cn(
                  "relative py-1 transition hover:text-white nav-link-indicator",
                  "after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-white after:content-[''] after:transition-transform after:duration-300 after:origin-left",
                  isActive("/")
                    ? "text-white font-bold after:scale-x-100"
                    : "after:scale-x-0",
                )}
                href="/"
              >
                {homeLabel}
              </Link>
              <Link
                className={cn(
                  "relative py-1 transition hover:text-white nav-link-indicator",
                  "after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-white after:content-[''] after:transition-transform after:duration-300 after:origin-left",
                  isActive("/privacy-policy")
                    ? "text-white font-bold after:scale-x-100"
                    : "after:scale-x-0",
                )}
                href="/privacy-policy"
              >
                {privacyLabel}
              </Link>
              <Link
                className={cn(
                  "relative py-1 transition hover:text-white nav-link-indicator",
                  "after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-white after:content-[''] after:transition-transform after:duration-300 after:origin-left",
                  isActive("/terms-of-service")
                    ? "text-white font-bold after:scale-x-100"
                    : "after:scale-x-0",
                )}
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
            <Button
              asChild
              variant="default"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link href="/auth/sign-in">{signInLabel}</Link>
            </Button>
            <Button
              type="button"
              variant="default"
              size="icon"
              className="sm:hidden"
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
            </Button>
          </div>
        </div>
        {isMenuOpen ? (
          <div
            className="mobile-menu-panel absolute left-6 right-6 top-full z-40 rounded-3xl px-4 py-4 text-sm text-white sm:hidden"
            data-testid="mobile-menu"
          >
            <nav
              className="flex flex-col gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button asChild variant="default" size="sm">
                <Link href="/auth/sign-in">{signInLabel}</Link>
              </Button>
              <Link
                className={cn(
                  "py-1 transition hover:text-white/80",
                  isActive("/") && "text-white font-bold",
                )}
                href="/"
              >
                {homeLabel}
              </Link>
              <Link
                className={cn(
                  "py-1 transition hover:text-white/80",
                  isActive("/privacy-policy") && "text-white font-bold",
                )}
                href="/privacy-policy"
              >
                {privacyLabel}
              </Link>
              <Link
                className={cn(
                  "py-1 transition hover:text-white/80",
                  isActive("/terms-of-service") && "text-white font-bold",
                )}
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
