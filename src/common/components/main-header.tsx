"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/common/components/button";
import { DocumentsDropdown } from "@/common/components/documents-dropdown";
import { MenuIcon } from "@/common/components/icons";
import {
  LanguageSelector,
  type LocaleOption,
} from "@/common/components/language-selector";
import type { ResolvedMenuItem } from "@/common/interfaces/menu-item";
import { Link, usePathname } from "@/common/routing/navigation";
import { cn } from "@/common/utils/cn";

type MainHeaderProps = {
  badge: string;
  menuItems: ResolvedMenuItem[];
  languageLabel: string;
  menuLabel: string;
  currentLocale: string;
  localeOptions: LocaleOption[];
  authSlot?: React.ReactNode;
};

const SCROLL_HIDE_THRESHOLD = 32;
const SCROLL_DELTA = 4;

const navLinkClass = cn(
  "relative py-1 transition hover:text-white nav-link-indicator",
  "after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:bg-white after:content-[''] after:transition-transform after:duration-300 after:origin-left",
);

export function MainHeader({
  badge,
  menuItems,
  languageLabel,
  menuLabel,
  currentLocale,
  localeOptions,
  authSlot,
}: MainHeaderProps) {
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
              {menuItems.map((item) =>
                item.children?.length ? (
                  <DocumentsDropdown
                    key={item.id}
                    documentsLabel={item.label}
                    items={item.children.map((c) => ({
                      label: c.label,
                      href: c.href,
                    }))}
                  />
                ) : (
                  <Link
                    key={item.id}
                    className={cn(
                      navLinkClass,
                      isActive(item.href)
                        ? "font-bold text-white after:scale-x-100"
                        : "after:scale-x-0",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
            <LanguageSelector
              languageLabel={languageLabel}
              currentLocale={currentLocale}
              localeOptions={localeOptions}
            />
            {authSlot != null ? (
              <div className="hidden sm:block">{authSlot}</div>
            ) : null}
            <Button
              type="button"
              variant="default"
              size="icon"
              className="sm:hidden"
              aria-label={menuLabel}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isMenuOpen ? (
          <div
            className="mobile-menu-panel absolute top-full right-6 left-6 z-40 rounded-3xl px-4 py-4 text-sm text-white sm:hidden"
            data-testid="mobile-menu"
          >
            <nav
              className="flex flex-col gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              {authSlot != null ? (
                <div className="sm:hidden">{authSlot}</div>
              ) : null}
              {menuItems.map((item) =>
                item.children?.length ? (
                  <span key={item.id}>
                    <span className="py-1 text-white/60">{item.label}</span>
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        className={cn(
                          "py-1 pl-3 transition hover:text-white/80",
                          isActive(child.href) && "font-bold text-white",
                        )}
                        href={child.href}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </span>
                ) : (
                  <Link
                    key={item.id}
                    className={cn(
                      "py-1 transition hover:text-white/80",
                      isActive(item.href) && "font-bold text-white",
                    )}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
