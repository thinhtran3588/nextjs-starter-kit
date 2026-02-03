"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/common/components/button";
import {
  ChevronDownIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
} from "@/common/components/icons";
import { useThemeStore, type Theme } from "@/common/hooks/use-theme-store";
import { cn } from "@/common/utils/cn";

export type ThemeOption = {
  theme: Theme;
  label: string;
};

type ThemeSelectorProps = {
  themeLabel: string;
  themeOptions: ThemeOption[];
  onThemeChange?: (theme: Theme) => void;
};

const themeIcons: Record<Theme, React.ComponentType<{ className?: string }>> = {
  system: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
};

export function ThemeSelector({
  themeLabel,
  themeOptions,
  onThemeChange,
}: ThemeSelectorProps) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = themeOptions.find((option) => option.theme === theme);
  const CurrentIcon = themeIcons[theme];

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
        aria-label={`${themeLabel}: ${currentOption?.label ?? ""}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <CurrentIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{currentOption?.label}</span>
        <ChevronDownIcon className="h-3 w-3" />
      </Button>
      {isOpen ? (
        <div
          className="glass-dropdown pointer-events-auto absolute right-0 z-40 mt-2 flex w-44 flex-col gap-1 rounded-2xl px-2 py-2 text-xs [color:var(--text-primary)]"
          role="listbox"
          aria-label={themeLabel}
        >
          {themeOptions.map((option) => {
            const isActive = option.theme === theme;
            const Icon = themeIcons[option.theme];

            return (
              <button
                key={option.theme}
                type="button"
                role="option"
                aria-selected={isActive}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition hover:bg-[var(--glass-highlight)]",
                  isActive ? "bg-[var(--glass-highlight)]" : "opacity-80",
                )}
                onClick={() => {
                  setTheme(option.theme);
                  onThemeChange?.(option.theme);
                  setIsOpen(false);
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
