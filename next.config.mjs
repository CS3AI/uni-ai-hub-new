import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint is run separately; skip during `next build`
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);
