import { Link } from "@/application/routing/navigation";
import { ScrollReveal } from "./components/scroll-reveal";

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="glow-orb float left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[rgba(139,184,255,0.45)]" />
      <div className="glow-orb float right-[-15%] top-[10%] h-[380px] w-[380px] bg-[rgba(126,249,216,0.35)]" />
      <div className="glow-orb float bottom-[-20%] left-[20%] h-[460px] w-[460px] bg-[rgba(139,184,255,0.2)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <div className="glass-panel flex items-center gap-3 rounded-full px-4 py-2 text-sm text-[var(--text-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--mint)] shadow-[0_0_12px_rgba(126,249,216,0.8)]" />
          Liquid Glass UI Kit
        </div>
        <nav className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
          <Link className="transition hover:text-white" href="/auth/sign-in">
            Sign in
          </Link>
          <Link className="transition hover:text-white" href="/privacy-policy">
            Privacy
          </Link>
          <Link
            className="transition hover:text-white"
            href="/terms-of-service"
          >
            Terms
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 pt-16">
        <section className="hero-grid glass-panel-strong liquid-border rounded-[32px] px-8 py-16 sm:px-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Next-level clarity
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Liquid glass surfaces for a calm, premium product experience.
              </h1>
              <p className="max-w-xl text-lg text-[var(--text-muted)]">
                Elevate your product launch with layered translucency, soft
                gradients, and motion that feels responsive to every scroll.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(139,184,255,0.25)] transition hover:translate-y-[-2px] hover:shadow-[0_18px_40px_rgba(139,184,255,0.35)]"
                  href="/app"
                >
                  Go to main app
                </Link>
                <Link
                  className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:text-white"
                  href="/auth/sign-up"
                >
                  Create an account
                </Link>
              </div>
            </div>
            <div className="glass-panel rounded-3xl p-6">
              <div className="space-y-5">
                <div className="glass-panel-strong rounded-2xl px-5 py-4">
                  <p className="text-sm text-[var(--text-muted)]">
                    Active sessions
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    28,490
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="glass-panel rounded-2xl px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                      Momentum
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      +42%
                    </p>
                  </div>
                  <div className="glass-panel rounded-2xl px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                      Latency
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      48ms
                    </p>
                  </div>
                </div>
                <div className="glass-panel rounded-2xl px-4 py-5">
                  <p className="text-sm text-[var(--text-muted)]">
                    Smooth onboarding, personalization, and security all woven
                    into a single glass stack.
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
                title: "Clarity at every depth",
                description:
                  "Layered glass panels keep information organized while preserving a calm, premium mood.",
              },
              {
                title: "Motion that follows intent",
                description:
                  "Subtle scroll reveals and hovering glows guide attention without distracting.",
              },
              {
                title: "Designed for trust",
                description:
                  "Glassmorphism paired with high contrast typography keeps data accessible.",
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
                Built for high-signal launches
              </h2>
              <p className="mt-4 text-base text-[var(--text-muted)]">
                Combine storytelling with crisp metrics. Showcase your roadmap,
                security, and onboarding flows with scroll-triggered reveals and
                gentle parallax motion.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                <span className="glass-panel rounded-full px-4 py-2">
                  Glass tokens
                </span>
                <span className="glass-panel rounded-full px-4 py-2">
                  Scroll cues
                </span>
                <span className="glass-panel rounded-full px-4 py-2">
                  Performance ready
                </span>
              </div>
            </div>
            <div className="glass-panel rounded-[28px] px-6 py-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    Data glow
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">1.8x</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    higher engagement
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                    Retention lift
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">+33%</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    in the first month
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
                  A story-driven scroll
                </h2>
                <p className="text-base text-[var(--text-muted)]">
                  Every section breathes with your narrative. Highlight feature
                  velocity, trusted security, and joyful onboarding sequences
                  with intentional pacing.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Onboard in minutes",
                  "Live performance insights",
                  "Context-aware prompts",
                  "Adaptive security layers",
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
                  Trusted by teams
                </p>
                <h2 className="text-3xl font-semibold text-white">
                  Give every stakeholder a clear signal.
                </h2>
                <p className="text-base text-[var(--text-muted)]">
                  Glass surfaces frame the story while the rest of the canvas
                  stays focused on what matters: your product&apos;s outcome.
                </p>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    name: "Nova Labs",
                    quote:
                      "The glass interface gave our launch a sense of calm trust.",
                  },
                  {
                    name: "Orion Studio",
                    quote:
                      "We shipped a premium landing in a weekend with the glass kit.",
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
              Ready to launch with clarity?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--text-muted)]">
              Bring the liquid glass aesthetic into your core product journey.
              The main app experience is ready for you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-2px]"
                href="/app"
              >
                Go to main app
              </Link>
              <Link
                className="glass-panel rounded-full px-6 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:text-white"
                href="/auth/sign-in"
              >
                Sign in
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </main>
    </div>
  );
}
