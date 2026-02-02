import createMiddleware from "next-intl/middleware";
import { routing } from "@/common/routing/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
