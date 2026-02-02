import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/application/i18n/request.ts");

const nextConfig = {};

export default withNextIntl(nextConfig);
