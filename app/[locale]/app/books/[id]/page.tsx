import { BookDetailPage } from "@/modules/books/pages/detail/page";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <BookDetailPage bookId={id} />;
}
