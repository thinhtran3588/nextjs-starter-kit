import { AuthVerification } from "@/modules/auth/components/auth-verification";
import { ProfilePage } from "@/modules/auth/pages/profile/page";

export default function ProfileRoute() {
  return (
    <AuthVerification>
      <ProfilePage />
    </AuthVerification>
  );
}
