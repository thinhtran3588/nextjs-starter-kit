import { AuthLayout } from "@/modules/auth/components/auth-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout showLanguageSelector={false}>{children}</AuthLayout>;
}
