"use client";

import { useTranslations } from "next-intl";

import { ProfileForm } from "./components/profile-form";

export function ProfilePage() {
  const t = useTranslations("modules.auth.pages.profile");

  return (
    <div className="space-y-6">
      <h1 className="mt-14 mb-6 text-4xl font-semibold text-[var(--text-primary)] sm:text-5xl">
        {t("title")}
      </h1>
      <ProfileForm />
    </div>
  );
}
