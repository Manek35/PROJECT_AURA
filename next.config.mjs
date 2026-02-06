/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com", "gateway.thegraph.com"],
  },

  async redirects() {
    return [
      {
        source: "/swap",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
