import { AppInitializer } from "@/common/components/layout/app-initializer";

type RootLayoutProps = {
  children: React.ReactNode;
};

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen">
      <AppInitializer />
      {children}
    </div>
  );
}
