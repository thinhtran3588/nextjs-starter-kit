import { getMainMenuConfig } from "@/application/config/main-menu";
import { MainLayout } from "@/common/components/main-layout";
import { resolveMenuItems } from "@/common/utils/menu";
import { AuthHeaderSlot } from "@/modules/auth/components/auth-header-slot";
import { getTranslations } from "next-intl/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tCommon = await getTranslations("common");
  const menuConfig = getMainMenuConfig();
  const menuItems = resolveMenuItems(menuConfig, (key) => tCommon(key));

  return (
    <MainLayout menuItems={menuItems} authSlot={<AuthHeaderSlot />}>
      {children}
    </MainLayout>
  );
}
