/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,

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
