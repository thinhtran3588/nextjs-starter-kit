import { getTranslations } from "next-intl/server";

import { Button } from "@/common/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/card";
import { Link } from "@/common/routing/navigation";
import { cn } from "@/common/utils/cn";
import { ScrollReveal } from "./components/scroll-reveal";

export async function LandingPage() {
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("modules.landing.pages.home");

  return (
    <>
      <div className="flex flex-col gap-20 sm:gap-24">
        <section className="hero-shine hero-grid glass-panel-strong liquid-border rounded-2xl px-6 py-12 sm:rounded-3xl sm:px-10 sm:py-16">
          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              <p className="hero-entrance hero-entrance-delay-1 text-xs font-medium tracking-[0.3em] text-[var(--text-muted)] uppercase">
                {tHome("hero.eyebrow")}
              </p>
              <h1 className="hero-entrance hero-entrance-delay-2 text-3xl leading-tight font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                {tHome("hero.title")}
              </h1>
              <p className="hero-entrance hero-entrance-delay-3 max-w-xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                {tHome("hero.subtitle")}
              </p>
              <div className="hero-entrance hero-entrance-delay-4 flex flex-wrap gap-3">
                <Button asChild variant="default">
                  <Link href="/app">{tCommon("navigation.goToApp")}</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/auth/sign-up">
                    {tCommon("navigation.createAccount")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  label: tHome("highlights.architecture.label"),
                  description: tHome("highlights.architecture.description"),
                },
                {
                  label: tHome("highlights.coverage.label"),
                  description: tHome("highlights.coverage.description"),
                },
                {
                  label: tHome("highlights.i18n.label"),
                  description: tHome("highlights.i18n.description"),
                },
              ].map((item, index) => (
                <Card
                  key={item.label}
                  className={cn(
                    "hero-entrance px-4 py-4 sm:px-5 sm:py-5",
                    index === 0 && "hero-entrance-delay-4",
                    index === 1 && "hero-entrance-delay-5",
                    index === 2 && "hero-entrance-delay-6",
                  )}
                >
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle className="text-sm">{item.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <CardDescription className="text-xs">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] sm:text-2xl">
              {tHome("features.architecture.title")}
            </h2>
            <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
              {tHome("features.architecture.description")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: tHome("features.modular.title"),
                  description: tHome("features.modular.description"),
                },
                {
                  title: tHome("features.stack.title"),
                  description: tHome("features.stack.description"),
                },
              ].map((item) => (
                <Card key={item.title} className="px-5 py-5 sm:rounded-2xl">
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <Card
            variant="strong"
            className="rounded-2xl px-6 py-10 sm:rounded-3xl sm:px-10 sm:py-12"
          >
            <h2 className="text-xl font-semibold text-[var(--text-primary)] sm:text-2xl">
              {tHome("techStack.title")}
            </h2>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "nextjs",
                "react",
                "typescript",
                "tailwind",
                "shadcn",
                "zustand",
                "rhf",
                "zod",
                "nextIntl",
                "vitest",
              ].map((key) => (
                <li
                  key={key}
                  className="flex items-center gap-3 text-sm text-[var(--text-muted)]"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--glass-highlight)] text-xs text-[var(--text-primary)]"
                    aria-hidden
                  >
                    ✓
                  </span>
                  {tHome(`techStack.tags.${key}`)}
                </li>
              ))}
            </ul>
          </Card>
        </ScrollReveal>

        <ScrollReveal>
          <section className="grid gap-8 lg:grid-cols-[0.5fr_0.5fr] lg:items-start">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] sm:text-2xl">
                {tHome("gettingStarted.title")}
              </h2>
              <p className="text-sm text-[var(--text-muted)] sm:text-base">
                {tHome("gettingStarted.description")}
              </p>
            </div>
            <div className="space-y-3">
              <code className="block rounded-lg bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.install")}
              </code>
              <code className="block rounded-lg bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.dev")}
              </code>
              <code className="block rounded-lg bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.validate")}
              </code>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] sm:text-2xl">
              {tHome("docs.title")}
            </h2>
            <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
              {tHome("docs.description")}
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  key: "architecture",
                  titleKey: "docs.items.architecture.title",
                  descKey: "docs.items.architecture.description",
                },
                {
                  key: "development",
                  titleKey: "docs.items.development.title",
                  descKey: "docs.items.development.description",
                },
                {
                  key: "testing",
                  titleKey: "docs.items.testing.title",
                  descKey: "docs.items.testing.description",
                },
              ].map(({ key: itemKey, titleKey, descKey }) => (
                <Card key={itemKey} className="px-5 py-5 sm:rounded-2xl">
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle>{tHome(titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <CardDescription>{tHome(descKey)}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </>
  );
}
