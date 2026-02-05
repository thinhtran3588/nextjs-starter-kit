import { Page } from "@/common/components/page";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Page>{children}</Page>;
}
