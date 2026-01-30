import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  "./src/application/routing/request.ts",
);

const nextConfig = {};

export default withNextIntl(nextConfig);
