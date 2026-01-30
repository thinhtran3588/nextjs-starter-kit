import { Link } from "@/application/routing/navigation";

type SimplePageProps = {
  title: string;
  href?: string;
  ctaLabel: string;
};

export function SimplePage({ title, href = "/", ctaLabel }: SimplePageProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center justify-center px-6 py-20">
      <div className="glass-panel rounded-3xl px-8 py-10 text-center">
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {title}
        </h1>
        <Link
          className="glass-panel mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-2px]"
          href={href}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
