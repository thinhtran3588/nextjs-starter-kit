"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/application/routing/navigation";
import { Button } from "@/common/components/ui/button";

function BackArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

export function BackToHomeButton() {
  const t = useTranslations("common.navigation");

  return (
    <Button asChild variant="secondary" size="sm">
      <Link href="/">
        <BackArrowIcon />
        {t("backToHome")}
      </Link>
    </Button>
  );
}
