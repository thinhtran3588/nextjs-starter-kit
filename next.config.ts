import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/common/routing/request.ts");

const nextConfig = {};

export default withNextIntl(nextConfig);
