import { routing } from "@/application/routing/routing";
import { Link } from "@/application/routing/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ScrollReveal } from "./components/scroll-reveal";

export async function LandingPage() {
  const tCommon = await getTranslations("common");
  const tHome = await getTranslations("modules.landing.pages.home");
  const locale = await getLocale();

  return (
    <div className="relative overflow-hidden">
      <div className="glow-orb float left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[rgba(139,184,255,0.45)]" />
      <div className="glow-orb float right-[-15%] top-[10%] h-[380px] w-[380px] bg-[rgba(126,249,216,0.35)]" />
      <div className="glow-orb float bottom-[-20%] left-[20%] h-[460px] w-[460px] bg-[rgba(139,184,255,0.2)]" />

      <header className="relative z-30 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="glass-panel flex w-fit items-center gap-3 rounded-full px-4 py-2 text-sm text-[var(--text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--mint)] shadow-[0_0_12px_rgba(126,249,216,0.8)]" />
          {tHome("badge")}
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm text-[var(--text-muted)] sm:w-auto sm:flex-nowrap sm:justify-end">
          <nav className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link className="transition hover:text-white" href="/auth/sign-in">
              {tCommon("navigation.signIn")}
            </Link>
            <Link
              className="transition hover:text-white"
              href="/privacy-policy"
            >
              {tCommon("navigation.privacy")}
            </Link>
            <Link
              className="transition hover:text-white"
              href="/terms-of-service"
            >
              {tCommon("navigation.terms")}
            </Link>
          </nav>
          <details className="group relative">
            <summary
              className="glass-panel flex cursor-pointer list-none items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:text-white"
              aria-label={`${tCommon("language.label")}: ${tCommon(
                `language.options.${locale}`,
              )}`}
            >
              <span className="text-sm">
                {tCommon(`language.flags.${locale}`)}
              </span>
              <span>{tCommon(`language.options.${locale}`)}</span>
              <span aria-hidden="true">▾</span>
            </summary>
            <div className="glass-panel-strong pointer-events-auto absolute right-0 z-40 mt-2 flex w-44 flex-col gap-1 rounded-2xl bg-[rgba(8,12,24,0.9)] px-2 py-2 text-xs text-white shadow-[0_20px_55px_rgba(0,0,0,0.45)] backdrop-blur">
              {routing.locales.map((targetLocale) => {
                const isActive = targetLocale === locale;

                return (
                  <Link
                    key={targetLocale}
                    className={`flex items-center gap-2 rounded-full px-3 py-2 font-semibold transition hover:bg-white/10 ${
                      isActive ? "bg-white/10 text-white" : "text-white/80"
                    }`}
                    href="/"
                    locale={targetLocale}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span className="text-sm">
                      {tCommon(`language.flags.${targetLocale}`)}
                    </span>
                    <span>{tCommon(`language.options.${targetLocale}`)}</span>
                  </Link>
                );
              })}
            </div>
          </details>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16">
        <section className="hero-grid glass-panel-strong liquid-border rounded-[32px] px-8 py-16 sm:px-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-muted)]">
                {tHome("hero.eyebrow")}
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {tHome("hero.title")}
              </h1>
              <p className="max-w-xl text-lg text-[var(--text-muted)]">
                {tHome("hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(139,184,255,0.25)] transition hover:translate-y-[-2px] hover:shadow-[0_18px_40px_rgba(139,184,255,0.35)]"
                  href="/app"
                >
                  {tCommon("navigation.goToApp")}
                </Link>
                <Link
                  className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:text-white"
                  href="/auth/sign-up"
                >
                  {tCommon("navigation.createAccount")}
                </Link>
              </div>
            </div>
            <div className="glass-panel rounded-3xl p-6">
              <div className="space-y-5">
                <div className="glass-panel-strong rounded-2xl px-5 py-4">
                  <p className="text-sm text-[var(--text-muted)]">
                    {tHome("stats.activeSessions.label")}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {tHome("stats.activeSessions.value")}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="glass-panel rounded-2xl px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                      {tHome("stats.momentum.label")}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {tHome("stats.momentum.value")}
                    </p>
                  </div>
                  <div className="glass-panel rounded-2xl px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                      {tHome("stats.latency.label")}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {tHome("stats.latency.value")}
                    </p>
                  </div>
                </div>
                <div className="glass-panel rounded-2xl px-4 py-5">
                  <p className="text-sm text-[var(--text-muted)]">
                    {tHome("stats.note")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ScrollReveal>
          <section className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: tHome("features.clarity.title"),
                description: tHome("features.clarity.description"),
              },
              {
                title: tHome("features.motion.title"),
                description: tHome("features.motion.description"),
              },
              {
                title: tHome("features.trust.title"),
                description: tHome("features.trust.description"),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-panel rounded-3xl px-6 py-8"
              >
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="grid gap-8 lg:grid-cols-[0.65fr_0.35fr] lg:items-center">
            <div className="glass-panel-strong rounded-[28px] px-8 py-10">
              <h2 className="text-3xl font-semibold text-white">
                {tHome("launch.title")}
              </h2>
              <p className="mt-4 text-base text-[var(--text-muted)]">
                {tHome("launch.description")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                <span className="glass-panel rounded-full px-4 py-2">
                  {tHome("launch.tags.glassTokens")}
                </span>
                <span className="glass-panel rounded-full px-4 py-2">
                  {tHome("launch.tags.scrollCues")}
                </span>
                <span className="glass-panel rounded-full px-4 py-2">
                  {tHome("launch.tags.performanceReady")}
                </span>
              </div>
            </div>
            <div className="glass-panel rounded-[28px] px-6 py-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    {tHome("metrics.dataGlow.label")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {tHome("metrics.dataGlow.value")}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {tHome("metrics.dataGlow.caption")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    {tHome("metrics.retentionLift.label")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {tHome("metrics.retentionLift.value")}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {tHome("metrics.retentionLift.caption")}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="glass-panel-strong rounded-[32px] px-8 py-12">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-semibold text-white">
                  {tHome("story.title")}
                </h2>
                <p className="text-base text-[var(--text-muted)]">
                  {tHome("story.description")}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  tHome("story.pills.onboard"),
                  tHome("story.pills.insights"),
                  tHome("story.pills.prompts"),
                  tHome("story.pills.security"),
                ].map((label) => (
                  <div
                    key={label}
                    className="glass-panel rounded-2xl px-4 py-5 text-sm text-white"
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="glass-panel rounded-[32px] px-8 py-12">
            <div className="grid gap-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  {tHome("trust.eyebrow")}
                </p>
                <h2 className="text-3xl font-semibold text-white">
                  {tHome("trust.title")}
                </h2>
                <p className="text-base text-[var(--text-muted)]">
                  {tHome("trust.description")}
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    name: tHome("trust.testimonials.nova.name"),
                    quote: tHome("trust.testimonials.nova.quote"),
                  },
                  {
                    name: tHome("trust.testimonials.orion.name"),
                    quote: tHome("trust.testimonials.orion.quote"),
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="glass-panel-strong rounded-2xl px-6 py-6"
                  >
                    <p className="text-sm text-white">“{item.quote}”</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="glass-panel-strong rounded-[32px] px-8 py-12 text-center">
            <h2 className="text-3xl font-semibold text-white">
              {tHome("cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--text-muted)]">
              {tHome("cta.description")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-2px]"
                href="/app"
              >
                {tCommon("navigation.goToApp")}
              </Link>
              <Link
                className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:text-white"
                href="/auth/sign-in"
              >
                {tCommon("navigation.signIn")}
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </div>
  );
}
