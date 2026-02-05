"use client";

import { useTranslations } from "next-intl";

import { ProfileForm } from "./components/profile-form";

export function ProfilePage() {
  const t = useTranslations("modules.auth.pages.profile");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="title-accent-underline text-2xl font-semibold text-[var(--text-primary)]">
        {t("title")}
      </h1>
      <ProfileForm />
    </div>
  );
}
