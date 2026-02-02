"use client";

import { useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "@/common/components/icons";
import { Link, usePathname } from "@/common/routing/navigation";
import { cn } from "@/common/utils/cn";

export type DocItem = {
  label: string;
  href: string;
};

type DocumentsDropdownProps = {
  documentsLabel: string;
  items: DocItem[];
};

export function DocumentsDropdown({
  documentsLabel,
  items,
}: DocumentsDropdownProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = pathname.startsWith("/docs");

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
        className={cn(
          "nav-link-indicator relative flex items-center gap-1 py-1 transition hover:text-white",
          "after:absolute after:bottom-0 after:left-0 after:block after:h-0.5 after:w-full after:origin-left after:bg-white after:transition-transform after:duration-300 after:content-['']",
          isActive
            ? "font-bold text-white after:scale-x-100"
            : "after:scale-x-0",
        )}
        aria-label={documentsLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {documentsLabel}
        <ChevronDownIcon
          className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen ? (
        <div
          className="glass-panel-strong pointer-events-auto absolute left-0 z-40 mt-2 flex min-w-48 flex-col gap-0.5 rounded-2xl bg-[rgba(8,12,24,0.9)] px-2 py-2 text-sm text-white shadow-[0_20px_55px_rgba(0,0,0,0.45)] backdrop-blur"
          role="menu"
          aria-label={documentsLabel}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className={cn(
                "rounded-lg px-3 py-2 font-medium transition hover:bg-white/10 hover:text-white",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-white/80",
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
