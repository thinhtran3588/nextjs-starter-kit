import { DocPage } from "@/modules/docs/presentation/pages/doc/page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <DocPage slug={slug} />;
}
