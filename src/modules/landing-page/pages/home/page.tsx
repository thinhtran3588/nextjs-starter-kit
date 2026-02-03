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
      <div className="flex flex-col gap-28 sm:gap-32">
        <section className="hero-shine glass-panel-strong liquid-border rounded-2xl px-8 py-14 sm:rounded-3xl sm:px-12 sm:py-20">
          <div className="relative z-10 flex flex-col items-center gap-12 text-center lg:gap-16">
            <div className="max-w-2xl space-y-6">
              <p className="hero-entrance hero-entrance-delay-1 text-xs font-medium tracking-[0.28em] text-[var(--text-muted)] uppercase">
                {tHome("hero.eyebrow")}
              </p>
              <h1 className="hero-entrance hero-entrance-delay-2 text-3xl leading-tight font-semibold text-[var(--text-primary)] sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                {tHome("hero.title")}
              </h1>
              <p className="hero-entrance hero-entrance-delay-3 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
                {tHome("hero.subtitle")}
              </p>
              <div className="hero-entrance hero-entrance-delay-4 flex flex-wrap justify-center gap-3">
                <Button asChild variant="default" className="min-w-[140px]">
                  <Link href="/app">{tCommon("navigation.goToApp")}</Link>
                </Button>
                <Button asChild variant="secondary" className="min-w-[140px]">
                  <Link href="/auth/sign-up">
                    {tCommon("navigation.createAccount")}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-3">
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
                    "bento-card hero-entrance px-5 py-5 sm:rounded-2xl sm:px-6 sm:py-6",
                    index === 0 && "hero-entrance-delay-4",
                    index === 1 && "hero-entrance-delay-5",
                    index === 2 && "hero-entrance-delay-6",
                  )}
                >
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle className="text-sm font-medium">
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <CardDescription className="text-xs leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                {tHome("features.architecture.title")}
              </h2>
              <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                {tHome("features.architecture.description")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
              <Card className="bento-card col-span-1 px-6 py-6 sm:rounded-2xl lg:col-span-7">
                <CardHeader className="space-y-0 pb-0">
                  <CardTitle>{tHome("features.modular.title")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <CardDescription>
                    {tHome("features.modular.description")}
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="bento-card col-span-1 px-6 py-6 sm:rounded-2xl lg:col-span-5">
                <CardHeader className="space-y-0 pb-0">
                  <CardTitle>{tHome("features.stack.title")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <CardDescription>
                    {tHome("features.stack.description")}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <Card
            variant="strong"
            className="bento-card rounded-2xl px-8 py-10 sm:rounded-3xl sm:px-12 sm:py-14"
          >
            <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
              {tHome("techStack.title")}
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-highlight)] text-xs text-[var(--text-primary)]"
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
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-4 lg:col-span-5">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                {tHome("gettingStarted.title")}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
                {tHome("gettingStarted.description")}
              </p>
            </div>
            <div className="space-y-3 lg:col-span-7">
              <code className="block rounded-xl border border-[var(--glass-border)] bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.install")}
              </code>
              <code className="block rounded-xl border border-[var(--glass-border)] bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.dev")}
              </code>
              <code className="block rounded-xl border border-[var(--glass-border)] bg-[var(--code-bg)] px-4 py-3 font-mono text-sm text-[var(--text-primary)]">
                {tHome("gettingStarted.steps.validate")}
              </code>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                {tHome("docs.title")}
              </h2>
              <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
                {tHome("docs.description")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
              {[
                {
                  key: "architecture",
                  titleKey: "docs.items.architecture.title",
                  descKey: "docs.items.architecture.description",
                  span: "lg:col-span-4",
                },
                {
                  key: "development",
                  titleKey: "docs.items.development.title",
                  descKey: "docs.items.development.description",
                  span: "lg:col-span-4",
                },
                {
                  key: "testing",
                  titleKey: "docs.items.testing.title",
                  descKey: "docs.items.testing.description",
                  span: "lg:col-span-4",
                },
              ].map(({ key: itemKey, titleKey, descKey, span }) => (
                <Card
                  key={itemKey}
                  className={cn("bento-card px-6 py-6 sm:rounded-2xl", span)}
                >
                  <CardHeader className="space-y-0 pb-0">
                    <CardTitle>{tHome(titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
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
