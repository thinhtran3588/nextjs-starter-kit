import { BackToHomeButton } from "@/common/components/back-to-home-button";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Locale } from "@/application/routing/routing";
import { isSupportedLocale } from "@/application/routing/routing";
import { readDocContent } from "@/modules/docs/lib/read-doc";
import { MarkdownContent } from "@/modules/docs/components/markdown-content";

type DocPageProps = {
  slug: string;
};

export async function DocPage({ slug }: DocPageProps) {
  const locale = (await getLocale()) as Locale;
  if (!isSupportedLocale(locale)) {
    notFound();
  }
  const content = await readDocContent(slug, locale);
  if (content === null) {
    notFound();
  }

  return (
    <section className="glass-panel-strong liquid-border rounded-[32px] px-8 py-12 sm:px-14">
      <div className="mt-3">
        <MarkdownContent content={content} />
      </div>
      <div className="mt-12">
        <BackToHomeButton />
      </div>
    </section>
  );
}
