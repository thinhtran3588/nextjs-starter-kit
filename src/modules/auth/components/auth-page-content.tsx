import { Link } from "@/application/routing/navigation";

type AuthPageContentProps = {
  title: string;
};

export function AuthPageContent({ title }: AuthPageContentProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
      <Link
        className="glass-panel inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:translate-y-[-2px]"
        href="/"
      >
        Back to home
      </Link>
    </div>
  );
}
